import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaintFunction, PaintParams, DemoType, Point } from './types';
import Controls from './components/Controls';
import { executePaintFunction, getTimeScale, freeDraw, drawLine, drawRectangle, drawCircle, drawTriangle, drawPolygon } from './utils/paintLogic';
import * as demoLogic from './utils/demoLogic';
import { generateCosmicPrompt } from './services/geminiService';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [currentFunction, setCurrentFunction] = useState<PaintFunction>(PaintFunction.DrawSpiral);
  const [params, setParams] = useState<PaintParams>({
    intensity: 5,
    size: 30,
    speed: 5,
    primaryColor: '#ff6b6b',
    secondaryColor: '#4ecdc4',
    rainbowMode: false,
    rainbowSpeed: 5,
    lineWidth: 3,
    fillMode: 'stroke',
    smoothDrawing: false,
    text: "FuncPaint",
    font: "Orbitron",
    fontSize: 36,
    textEffect: "normal",
    textRainbow: false,
    mathFunction: "Math.sin(x)",
    xRange: 10,
    resolution: 100,
    functionType: 'cartesian'
  });
  const [erasing, setErasing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [demoType, setDemoType] = useState<DemoType>(DemoType.None);
  const [demoSpeed, setDemoSpeed] = useState(3);
  
  // Muse State
  const [musePrompt, setMusePrompt] = useState<string | null>(null);
  const [isMuseLoading, setIsMuseLoading] = useState(false);

  // History State for Undo/Redo
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);

  // References needed during callbacks
  const paramsRef = useRef(params);
  const demoTypeRef = useRef(demoType);
  const demoSpeedRef = useRef(demoSpeed);

  // Drawing State Refs
  const startPointRef = useRef<Point | null>(null);
  const lastPointsRef = useRef<Point[]>([]);
  
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    demoTypeRef.current = demoType;
    if (demoType !== DemoType.None && demoType !== DemoType.Random) {
       // Enable rainbow mode automatically for visual demos as per request
       setParams(prev => ({ ...prev, rainbowMode: true }));
    }
  }, [demoType]);

  useEffect(() => {
    demoSpeedRef.current = demoSpeed;
  }, [demoSpeed]);

  // Initialization & Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const ctx = canvas.getContext('2d');
        let savedData: ImageData | null = null;
        if (ctx && canvas.width > 0 && canvas.height > 0) {
           savedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        if (ctx) {
          if (savedData) {
              ctx.putImageData(savedData, 0, 0);
          } else {
              ctx.fillStyle = 'black';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              saveState();
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      }
      historyRef.current.push(data);
      if (historyRef.current.length > 50) historyRef.current.shift();
      historyIndexRef.current = historyRef.current.length - 1;
    }
  };

  const isShapeTool = (func: PaintFunction) => {
      return [
          PaintFunction.DrawLine,
          PaintFunction.DrawRectangle,
          PaintFunction.DrawCircle,
          PaintFunction.DrawTriangle,
          PaintFunction.DrawPolygon
      ].includes(func);
  };
  
  const isInstantTool = (func: PaintFunction) => {
      return [
          PaintFunction.FillArea,
          PaintFunction.WriteText,
          PaintFunction.FunctionPlot,
          PaintFunction.ParametricCurve,
          PaintFunction.PolarPlot,
          PaintFunction.VectorField
      ].includes(func);
  }

  // Drawing Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    startPointRef.current = { x, y };
    
    // For free draw, reset points
    if (currentFunction === PaintFunction.FreeDraw) {
        lastPointsRef.current = [{x, y}];
        // Draw the initial dot
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    } else if (isInstantTool(currentFunction)) {
       // Instant tools
       const canvas = canvasRef.current;
       const ctx = canvas?.getContext('2d');
       if (ctx) {
           executePaintFunction(ctx, currentFunction, x, y, paramsRef.current, 1);
           saveState();
       }
    } else if (!isShapeTool(currentFunction)) {
       // Immediate draw for cosmic functions and spray
       drawAt(x, y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (erasing) {
        drawAt(x, y);
        return;
    }

    if (isShapeTool(currentFunction)) {
        // Preview Shape Logic
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && startPointRef.current && historyIndexRef.current >= 0) {
            // Restore last committed state to clear previous preview frame
            const lastState = historyRef.current[historyIndexRef.current];
            ctx.putImageData(lastState, 0, 0);
            
            // Draw preview
            switch(currentFunction) {
                case PaintFunction.DrawLine:
                    drawLine(ctx, startPointRef.current.x, startPointRef.current.y, x, y, paramsRef.current);
                    break;
                case PaintFunction.DrawRectangle:
                    drawRectangle(ctx, startPointRef.current.x, startPointRef.current.y, x, y, paramsRef.current);
                    break;
                case PaintFunction.DrawCircle:
                    drawCircle(ctx, startPointRef.current.x, startPointRef.current.y, x, y, paramsRef.current);
                    break;
                case PaintFunction.DrawTriangle:
                    drawTriangle(ctx, startPointRef.current.x, startPointRef.current.y, x, y, paramsRef.current);
                    break;
                case PaintFunction.DrawPolygon:
                    drawPolygon(ctx, startPointRef.current.x, startPointRef.current.y, x, y, paramsRef.current);
                    break;
            }
        }
    } else if (currentFunction === PaintFunction.FreeDraw) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
             lastPointsRef.current.push({x, y});
             if (lastPointsRef.current.length > 5) lastPointsRef.current.shift();
             freeDraw(ctx, lastPointsRef.current, paramsRef.current);
        }
    } else if (!isInstantTool(currentFunction)) {
        // Continuous draw for cosmic functions and spray
        drawAt(x, y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDrawing) {
      setIsDrawing(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      
      // If shape tool, save final state
      if (isShapeTool(currentFunction) || currentFunction === PaintFunction.FreeDraw || (!isShapeTool(currentFunction) && !isInstantTool(currentFunction))) {
          saveState();
      }
      
      startPointRef.current = null;
      lastPointsRef.current = [];
    }
  };

  const drawAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (erasing) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, params.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      executePaintFunction(
        ctx,
        currentFunction,
        x,
        y,
        params,
        getTimeScale(params.speed)
      );
    }
  }, [erasing, params, currentFunction]);


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const data = historyRef.current[historyIndexRef.current];
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.putImageData(data, 0, 0);
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const data = historyRef.current[historyIndexRef.current];
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.putImageData(data, 0, 0);
    }
  };

  const savePNG = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'funcpaint-cosmic.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleCosmicMuse = async () => {
    setIsMuseLoading(true);
    setMusePrompt(null);
    const prompt = await generateCosmicPrompt();
    setMusePrompt(prompt);
    setIsMuseLoading(false);
  };

  // Demo Sequencer
  useEffect(() => {
    if (demoType === DemoType.None) return;

    let timeoutId: number;
    let animationFrameId: number;
    
    // Clear canvas before starting a structured demo
    if (demoType === DemoType.Landscape || demoType === DemoType.Portrait) {
       clearCanvas();
    }

    // --- RANDOM DEMO ---
    if (demoType === DemoType.Random) {
       let lastSwitchTime = 0;
       const funcs = Object.values(PaintFunction).filter(f => !isShapeTool(f) && !isInstantTool(f) && f !== PaintFunction.FreeDraw);
       let funcIndex = 0;

       const loop = (timestamp: number) => {
          if (demoTypeRef.current !== DemoType.Random) return;

          if (timestamp - lastSwitchTime > 2000) {
            funcIndex = (funcIndex + 1) % funcs.length;
            setCurrentFunction(funcs[funcIndex]);
            lastSwitchTime = timestamp;
          }

          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          
          if (canvas && ctx) {
            const t = timestamp / 1000;
            const x = canvas.width * 0.5 + Math.cos(t * 0.6) * canvas.width * 0.3;
            const y = canvas.height * 0.5 + Math.sin(t * 0.8) * canvas.height * 0.3;
            
            executePaintFunction(
              ctx,
              funcs[funcIndex],
              x,
              y,
              paramsRef.current,
              getTimeScale(paramsRef.current.speed)
            );
          }
          animationFrameId = requestAnimationFrame(loop);
       };
       animationFrameId = requestAnimationFrame(loop);
       return () => cancelAnimationFrame(animationFrameId);
    }

    // --- SCRIPTED DEMOS (Landscape / Portrait) ---
    let step = 0;
    
    const landscapeSteps = [
        { func: demoLogic.createStarField, delay: 0 },
        { func: demoLogic.createMountains, delay: 500 },
        { func: demoLogic.createNebula, delay: 800 },
        { func: demoLogic.createRiver, delay: 600 },
        { func: demoLogic.createTrees, delay: 700 },
        { func: demoLogic.createGalaxy, delay: 1000 },
        { func: demoLogic.addFloatingElements, delay: 400 }
    ];

    const portraitSteps = [
        { func: demoLogic.createFaceOutline, delay: 0 },
        { func: demoLogic.addEyes, delay: 600 },
        { func: demoLogic.addHair, delay: 800 },
        { func: demoLogic.addFacialFeatures, delay: 500 },
        { func: demoLogic.addAura, delay: 700 },
        { func: demoLogic.addBackgroundPattern, delay: 600 }
    ];

    const steps = demoType === DemoType.Landscape ? landscapeSteps : portraitSteps;

    const executeStep = () => {
       if (demoTypeRef.current !== demoType) return;
       
       if (step >= steps.length) {
          // Restart loop after a pause
          step = 0;
          if (demoTypeRef.current === demoType) { // Check again before clearing
             setTimeout(() => {
                if (demoTypeRef.current === demoType) {
                   clearCanvas();
                   executeStep();
                }
             }, 2000);
          }
          return;
       }

       const currentStep = steps[step];
       const canvas = canvasRef.current;
       const ctx = canvas?.getContext('2d');

       if (canvas && ctx) {
           currentStep.func(ctx, canvas.width, canvas.height, paramsRef.current);
       }
       
       step++;
       const calculatedDelay = Math.max(100, currentStep.delay * (10 / demoSpeedRef.current));
       timeoutId = window.setTimeout(executeStep, calculatedDelay);
    };

    // Start execution
    executeStep();

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrameId);
    };

  }, [demoType]); 

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      <header className="p-4 border-b border-[#ffffff1a] text-center bg-[#0f0c29]/50 backdrop-blur-md z-20 flex-none">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#ff8a00] via-[#da1b60] to-[#ff0080] text-transparent bg-clip-text drop-shadow-sm">
          FuncPaint™
        </h1>
        <p className="text-gray-300 text-xs md:text-base tracking-wide font-light hidden md:block">
          Paint by invoking functions • Breathe creatively • Cosmic Mathematics
        </p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        <Controls
          currentFunction={currentFunction}
          onSelectFunction={setCurrentFunction}
          params={params}
          onParamChange={(key, value) => setParams(prev => ({ ...prev, [key]: value }))}
          erasing={erasing}
          toggleEraser={() => setErasing(!erasing)}
          onClear={clearCanvas}
          onUndo={undo}
          onRedo={redo}
          onSave={savePNG}
          demoType={demoType}
          setDemoType={setDemoType}
          demoSpeed={demoSpeed}
          setDemoSpeed={setDemoSpeed}
          onCosmicMuse={handleCosmicMuse}
          isMuseLoading={isMuseLoading}
        />

        <div className="flex-1 p-2 lg:p-5 relative min-h-0" ref={containerRef}>
          {/* Muse Overlay */}
          {musePrompt && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md border border-[#ff0080]/50 px-6 py-3 rounded-full z-20 animate-fade-in-down shadow-[0_0_20px_rgba(255,0,128,0.3)] pointer-events-auto">
              <p className="text-[#ff8a00] italic text-lg text-center pr-6">
                 "{musePrompt}"
              </p>
              <button 
                onClick={() => setMusePrompt(null)}
                className="absolute top-2 right-3 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          <div className="w-full h-full border-2 border-[#ffffff1a] rounded-2xl overflow-hidden bg-black shadow-2xl relative group">
            <canvas
              ref={canvasRef}
              className="block cursor-crosshair touch-none w-full h-full"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            
            {/* HUD Status */}
            <div className="absolute top-4 right-4 bg-[#141428]/80 backdrop-blur px-4 py-2 rounded-lg border border-[#ffffff1a] text-sm pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-[#ff8a00]">fn: </span>{currentFunction}()
              {demoType !== DemoType.None && <span className="ml-2 text-blue-400">[{demoType.toUpperCase()}]</span>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;