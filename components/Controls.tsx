import React from 'react';
import { PaintFunction, PaintParams, DemoType, FillMode, TextEffect, FunctionType } from '../types';
import { 
  Eraser, 
  Trash2, 
  Undo, 
  Redo, 
  Download, 
  Play, 
  Square,
  Sparkles,
  Palette,
  MonitorPlay,
  PenTool,
  Shapes,
  PaintBucket,
  SprayCan,
  Type,
  Calculator,
  Sigma,
  Activity,
  Compass,
  Wind
} from 'lucide-react';

interface ControlsProps {
  currentFunction: PaintFunction;
  onSelectFunction: (func: PaintFunction) => void;
  params: PaintParams;
  onParamChange: (key: keyof PaintParams, value: number | string | boolean) => void;
  erasing: boolean;
  toggleEraser: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  demoType: DemoType;
  setDemoType: (type: DemoType) => void;
  demoSpeed: number;
  setDemoSpeed: (speed: number) => void;
  onCosmicMuse: () => void;
  isMuseLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  currentFunction,
  onSelectFunction,
  params,
  onParamChange,
  erasing,
  toggleEraser,
  onClear,
  onUndo,
  onRedo,
  onSave,
  demoType,
  setDemoType,
  demoSpeed,
  setDemoSpeed,
  onCosmicMuse,
  isMuseLoading
}) => {
  const cosmicFunctions = [
    PaintFunction.DrawSpiral,
    PaintFunction.EmitPulse,
    PaintFunction.ExpandHalo,
    PaintFunction.Coagulate,
    PaintFunction.BreatheSync,
    PaintFunction.OverlayCosmos,
    PaintFunction.RandomStars,
    PaintFunction.CurveSpace,
    PaintFunction.HeartBeat,
    PaintFunction.ForceField,
    PaintFunction.SacredGeometry,
    PaintFunction.SoundWaves,
    PaintFunction.NeuralNetwork,
    PaintFunction.Vortex,
    PaintFunction.CrystalForm,
    PaintFunction.FluidDynamics,
    PaintFunction.BinaryCode,
    PaintFunction.SpiralGalaxy,
    PaintFunction.FractalTree,
  ];

  const traditionalFunctions = [
    { func: PaintFunction.FreeDraw, icon: <PenTool size={14} />, label: 'Free' },
    { func: PaintFunction.DrawLine, icon: <div className="w-3 h-0.5 bg-current rotate-45" />, label: 'Line' },
    { func: PaintFunction.DrawRectangle, icon: <Square size={14} />, label: 'Rect' },
    { func: PaintFunction.DrawCircle, icon: <div className="w-3 h-3 rounded-full border-2 border-current" />, label: 'Circle' },
    { func: PaintFunction.DrawTriangle, icon: <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-current" />, label: 'Tri' },
    { func: PaintFunction.DrawPolygon, icon: <Shapes size={14} />, label: 'Poly' },
    { func: PaintFunction.SprayPaint, icon: <SprayCan size={14} />, label: 'Spray' },
    { func: PaintFunction.FillArea, icon: <PaintBucket size={14} />, label: 'Fill' },
  ];
  
  const mathFunctions = [
      { func: PaintFunction.FunctionPlot, icon: <Activity size={14} />, label: 'Plot' },
      { func: PaintFunction.ParametricCurve, icon: <Sigma size={14} />, label: 'Param' },
      { func: PaintFunction.PolarPlot, icon: <Compass size={14} />, label: 'Polar' },
      { func: PaintFunction.VectorField, icon: <Wind size={14} />, label: 'Vector' },
  ];

  const textFonts = [
      'Orbitron', 'Rajdhani', 'Exo 2', 'Audiowide', 'Michroma', 'Nasalization', 'Monoton', 'Russo One', 'Wallpoet', 'Silkscreen'
  ];
  
  const textEffects: TextEffect[] = [
      'normal', 'glow', 'neon', 'hologram', 'matrix', 'gradient', 'outline', 'cyber'
  ];

  const handlePresetChange = (preset: string) => {
    if (!preset) return;
    switch(preset) {
        case 'sin': onParamChange('mathFunction', "Math.sin(x)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'cos': onParamChange('mathFunction', "Math.cos(x)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'tan': onParamChange('mathFunction', "Math.tan(x)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'exp': onParamChange('mathFunction', "Math.exp(x/3)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'log': onParamChange('mathFunction', "Math.log(Math.abs(x)+1)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'polynomial': onParamChange('mathFunction', "(x*x*x - x)/10"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'gaussian': onParamChange('mathFunction', "Math.exp(-x*x/10)*5"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'sinc': onParamChange('mathFunction', "Math.sin(x)/(x||1)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'abs': onParamChange('mathFunction', "Math.abs(x)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'sawtooth': onParamChange('mathFunction', "x - Math.floor(x)"); onSelectFunction(PaintFunction.FunctionPlot); break;
        case 'butterfly': onParamChange('mathFunction', "Math.sin(t)*(Math.exp(Math.cos(t))-2*Math.cos(4*t)-Math.pow(Math.sin(t/12),5)), Math.cos(t)*(Math.exp(Math.cos(t))-2*Math.cos(4*t)-Math.pow(Math.sin(t/12),5))"); onSelectFunction(PaintFunction.ParametricCurve); break;
        case 'heart': onParamChange('mathFunction', "16*Math.pow(Math.sin(t),3), 13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)"); onSelectFunction(PaintFunction.ParametricCurve); break;
        case 'spiral': onParamChange('mathFunction', "t*Math.cos(t), t*Math.sin(t)"); onSelectFunction(PaintFunction.ParametricCurve); break;
        case 'flower': onParamChange('mathFunction', "Math.cos(5*t)*Math.cos(t), Math.cos(5*t)*Math.sin(t)"); onSelectFunction(PaintFunction.ParametricCurve); break;
    }
  };

  return (
    <div className="w-full lg:w-80 bg-[#141428]/90 backdrop-blur-sm border-r lg:border-r-0 border-b lg:border-b-0 border-[#ffffff1a] p-5 flex flex-col gap-6 h-auto lg:h-full overflow-y-auto z-10 lg:rounded-2xl lg:m-5 lg:border">
      <div>
        <h2 className="text-center text-[#ff8a00] text-xl font-bold mb-4 tracking-wider">
          Function Panel
        </h2>
        
        {/* Gemini Integration */}
        <button
            onClick={onCosmicMuse}
            disabled={isMuseLoading}
            className={`w-full mb-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
              isMuseLoading 
                ? 'bg-gray-700 cursor-wait opacity-70' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/30'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isMuseLoading ? 'animate-spin' : ''}`} />
            {isMuseLoading ? 'Consulting Stars...' : 'Cosmic Muse'}
        </button>

        {/* Traditional Tools */}
        <div className="mb-4 bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10]">
           <div className="flex items-center gap-2 mb-3 text-white/70">
            <PenTool size={16} />
            <span className="font-bold text-sm">Traditional Tools</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
             {traditionalFunctions.map((item) => (
                <button
                  key={item.func}
                  onClick={() => onSelectFunction(item.func)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
                    ${currentFunction === item.func && !erasing
                        ? 'bg-[#4ecdc4] text-[#0f0c29] font-bold shadow-[0_0_10px_rgba(78,205,196,0.5)]'
                        : 'bg-[#24243e] text-gray-400 hover:bg-[#343256] hover:text-white'
                    }
                  `}
                  title={item.label}
                >
                  {item.icon}
                  <span className="mt-1 text-[10px]">{item.label}</span>
                </button>
             ))}
          </div>
          <button
              onClick={() => onSelectFunction(PaintFunction.WriteText)}
              className={`
                w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs transition-all duration-200
                ${currentFunction === PaintFunction.WriteText && !erasing
                    ? 'bg-[#4ecdc4] text-[#0f0c29] font-bold shadow-[0_0_10px_rgba(78,205,196,0.5)]'
                    : 'bg-[#24243e] text-gray-400 hover:bg-[#343256] hover:text-white'
                }
              `}
          >
              <Type size={16} />
              <span>Write Text Tool</span>
          </button>
        </div>
        
        {/* Math Tools */}
        <div className="mb-4 bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10]">
            <div className="flex items-center gap-2 mb-3 text-white/70">
                <Calculator size={16} />
                <span className="font-bold text-sm">Math Tools</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {mathFunctions.map((item) => (
                    <button
                        key={item.func}
                        onClick={() => onSelectFunction(item.func)}
                        className={`
                            flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
                            ${currentFunction === item.func && !erasing
                                ? 'bg-[#9c27b0] text-white font-bold shadow-[0_0_10px_rgba(156,39,176,0.5)]'
                                : 'bg-[#24243e] text-gray-400 hover:bg-[#343256] hover:text-white'
                            }
                        `}
                        title={item.label}
                    >
                        {item.icon}
                        <span className="mt-1 text-[10px]">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Cosmic Tools */}
        <div className="grid grid-cols-2 gap-2 max-h-40 lg:max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {cosmicFunctions.map((func) => (
            <button
              key={func}
              onClick={() => onSelectFunction(func)}
              className={`
                px-3 py-3 rounded-lg text-xs font-medium transition-all duration-300 truncate
                ${
                  currentFunction === func && !erasing
                    ? 'bg-gradient-to-r from-[#da1b60] to-[#ff0080] text-white shadow-[0_0_15px_rgba(255,0,128,0.5)] transform -translate-y-0.5'
                    : 'bg-[#24243e] text-gray-300 hover:bg-[#343256] hover:-translate-y-0.5'
                }
              `}
              title={func}
            >
              {func}()
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Color Studio */}
        <div className="bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10]">
          <div className="flex items-center gap-2 mb-3 text-[#4ecdc4]">
            <Palette size={16} />
            <span className="font-bold text-sm">Color Studio</span>
          </div>
          
          <div className="flex gap-2 mb-3">
             <div className="flex-1">
               <label className="block text-[10px] text-gray-400 mb-1">Primary</label>
               <input 
                 type="color" 
                 value={params.primaryColor}
                 onChange={(e) => onParamChange('primaryColor', e.target.value)}
                 className="w-full h-8 rounded cursor-pointer bg-transparent"
               />
             </div>
             <div className="flex-1">
               <label className="block text-[10px] text-gray-400 mb-1">Secondary</label>
               <input 
                 type="color" 
                 value={params.secondaryColor}
                 onChange={(e) => onParamChange('secondaryColor', e.target.value)}
                 className="w-full h-8 rounded cursor-pointer bg-transparent"
               />
             </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={params.rainbowMode}
                onChange={(e) => onParamChange('rainbowMode', e.target.checked)}
                className="w-4 h-4 rounded accent-[#ff0080] cursor-pointer"
              />
              <span className={params.rainbowMode ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text font-bold" : ""}>
                Rainbow Mode
              </span>
            </label>
          </div>

          {params.rainbowMode && (
            <div className="animate-fade-in">
              <label className="flex justify-between text-[10px] text-gray-400 mb-1">
                Rainbow Speed <span>{params.rainbowSpeed}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={params.rainbowSpeed}
                onChange={(e) => onParamChange('rainbowSpeed', Number(e.target.value))}
                className="w-full accent-[#4ecdc4] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
        
        {/* Math Studio */}
        <div className={`bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10] border-l-4 border-l-[#9c27b0] ${[PaintFunction.FunctionPlot, PaintFunction.ParametricCurve, PaintFunction.PolarPlot, PaintFunction.VectorField].includes(currentFunction) ? 'block' : 'hidden'}`}>
             <div className="flex items-center gap-2 mb-3 text-[#9c27b0]">
                <Calculator size={16} />
                <span className="font-bold text-sm">Math Studio</span>
            </div>

            <label className="block text-[10px] text-gray-400 mb-1">Equation f(x) or x(t),y(t)</label>
            <input 
                type="text"
                placeholder="Math.sin(x)"
                value={params.mathFunction}
                onChange={(e) => onParamChange('mathFunction', e.target.value)}
                className="w-full bg-[#24243e] text-xs font-mono text-white rounded p-2 mb-3 border border-[#ffffff1a] focus:border-[#9c27b0] outline-none"
            />

            <label className="flex justify-between text-[10px] text-gray-400 mb-1">
                X Range <span>-{params.xRange} to {params.xRange}</span>
            </label>
            <input
                type="range"
                min="1"
                max="20"
                value={params.xRange}
                onChange={(e) => onParamChange('xRange', Number(e.target.value))}
                className="w-full accent-[#9c27b0] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-3"
            />

             <label className="flex justify-between text-[10px] text-gray-400 mb-1">
                Resolution <span>{params.resolution}</span>
            </label>
            <input
                type="range"
                min="10"
                max="500"
                value={params.resolution}
                onChange={(e) => onParamChange('resolution', Number(e.target.value))}
                className="w-full accent-[#9c27b0] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-3"
            />
            
            <label className="block text-[10px] text-gray-400 mb-1">Presets</label>
            <select 
                 onChange={(e) => handlePresetChange(e.target.value)}
                 className="w-full bg-[#24243e] text-xs text-gray-300 rounded p-1 mb-3 border border-[#ffffff1a] focus:border-[#9c27b0] outline-none"
            >
                 <option value="">-- Select Preset --</option>
                 <option value="sin">Sine: Math.sin(x)</option>
                 <option value="cos">Cosine: Math.cos(x)</option>
                 <option value="tan">Tangent: Math.tan(x)</option>
                 <option value="exp">Exponential: Math.exp(x/3)</option>
                 <option value="log">Logarithm: Math.log(Math.abs(x)+1)</option>
                 <option value="polynomial">Polynomial: (x*x*x - x)/10</option>
                 <option value="gaussian">Gaussian: Math.exp(-x*x/10)*5</option>
                 <option value="sinc">Sinc: Math.sin(x)/(x||1)</option>
                 <option value="abs">Absolute: Math.abs(x)</option>
                 <option value="sawtooth">Sawtooth: x - Math.floor(x)</option>
                 <option value="butterfly">Butterfly (Parametric)</option>
                 <option value="heart">Heart (Parametric)</option>
                 <option value="spiral">Spiral (Parametric)</option>
                 <option value="flower">Flower (Parametric)</option>
            </select>
        </div>

        {/* Text Studio */}
        <div className={`bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10] border-l-4 border-l-[#ff6b6b] ${currentFunction === PaintFunction.WriteText ? 'block' : 'hidden'}`}>
            <div className="flex items-center gap-2 mb-3 text-[#ff6b6b]">
                <Type size={16} />
                <span className="font-bold text-sm">Text Studio</span>
            </div>
            
            <input 
                type="text"
                placeholder="Type here..."
                maxLength={50}
                value={params.text}
                onChange={(e) => onParamChange('text', e.target.value)}
                className="w-full bg-[#24243e] text-sm text-white rounded p-2 mb-3 border border-[#ffffff1a] focus:border-[#ff6b6b] outline-none"
            />
            
            <select 
                 value={params.font}
                 onChange={(e) => onParamChange('font', e.target.value)}
                 className="w-full bg-[#24243e] text-xs text-gray-300 rounded p-1 mb-3 border border-[#ffffff1a] focus:border-[#ff6b6b] outline-none"
                 style={{ fontFamily: params.font }}
            >
                 {textFonts.map(font => (
                     <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                 ))}
            </select>
            
            <select 
                 value={params.textEffect}
                 onChange={(e) => onParamChange('textEffect', e.target.value)}
                 className="w-full bg-[#24243e] text-xs text-gray-300 rounded p-1 mb-3 border border-[#ffffff1a] focus:border-[#ff6b6b] outline-none capitalize"
            >
                 {textEffects.map(effect => (
                     <option key={effect} value={effect}>{effect}</option>
                 ))}
            </select>
            
             <label className="flex justify-between text-[10px] text-gray-400 mb-1">
                Font Size <span>{params.fontSize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="120"
                value={params.fontSize}
                onChange={(e) => onParamChange('fontSize', Number(e.target.value))}
                className="w-full accent-[#ff6b6b] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-3"
              />
              
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={params.textRainbow}
                onChange={(e) => onParamChange('textRainbow', e.target.checked)}
                className="w-3 h-3 rounded accent-[#ff6b6b] cursor-pointer"
              />
              <span>Text Rainbow</span>
            </label>
        </div>

        {/* Tool Settings */}
        <div className="bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10]">
          <label className="flex justify-between text-xs text-gray-300 mb-2">
            Line Width <span>{params.lineWidth}</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={params.lineWidth}
            onChange={(e) => onParamChange('lineWidth', Number(e.target.value))}
            className="w-full accent-[#4ecdc4] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-3"
          />

          <label className="block text-xs text-gray-300 mb-1">Fill Mode</label>
          <select 
             value={params.fillMode}
             onChange={(e) => onParamChange('fillMode', e.target.value)}
             className="w-full bg-[#24243e] text-xs text-gray-300 rounded p-1 mb-3 border border-[#ffffff1a] focus:border-[#4ecdc4] outline-none"
          >
             <option value="stroke">Stroke Only</option>
             <option value="fill">Fill Only</option>
             <option value="both">Both</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={params.smoothDrawing}
                onChange={(e) => onParamChange('smoothDrawing', e.target.checked)}
                className="w-3 h-3 rounded accent-[#4ecdc4] cursor-pointer"
              />
              <span>Smooth Drawing</span>
          </label>
        </div>

        {/* Demo Studio */}
        <div className="bg-[#1a1a2e] p-3 rounded-xl border border-[#ffffff10]">
          <div className="flex items-center gap-2 mb-3 text-[#ff8a00]">
            <MonitorPlay size={16} />
            <span className="font-bold text-sm">Demo Studio</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
               onClick={() => setDemoType(demoType === DemoType.Landscape ? DemoType.None : DemoType.Landscape)}
               className={`text-xs p-2 rounded border ${demoType === DemoType.Landscape ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-[#24243e] border-transparent text-gray-400 hover:bg-[#343256]'}`}
            >
              🌌 Landscape
            </button>
            <button
               onClick={() => setDemoType(demoType === DemoType.Portrait ? DemoType.None : DemoType.Portrait)}
               className={`text-xs p-2 rounded border ${demoType === DemoType.Portrait ? 'bg-pink-600 border-pink-400 text-white' : 'bg-[#24243e] border-transparent text-gray-400 hover:bg-[#343256]'}`}
            >
              👤 Portrait
            </button>
            <button
               onClick={() => setDemoType(demoType === DemoType.Random ? DemoType.None : DemoType.Random)}
               className={`text-xs p-2 rounded border ${demoType === DemoType.Random ? 'bg-green-600 border-green-400 text-white' : 'bg-[#24243e] border-transparent text-gray-400 hover:bg-[#343256]'}`}
            >
              🎲 Random
            </button>
            <button
               onClick={() => setDemoType(DemoType.None)}
               className="text-xs p-2 rounded border bg-[#24243e] border-transparent text-red-400 hover:bg-red-900/30"
            >
              ⏹️ Stop
            </button>
          </div>

          <div>
             <label className="flex justify-between text-[10px] text-gray-400 mb-1">
                Demo Speed <span>{demoSpeed}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={demoSpeed}
                onChange={(e) => setDemoSpeed(Number(e.target.value))}
                className="w-full accent-[#ff8a00] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
          </div>
        </div>

        {/* Parameters */}
        <div>
          <label className="flex justify-between text-sm text-gray-300 mb-1">
            Intensity <span>{params.intensity}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={params.intensity}
            onChange={(e) => onParamChange('intensity', Number(e.target.value))}
            className="w-full accent-[#ff8a00] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm text-gray-300 mb-1">
            Size <span>{params.size}</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={params.size}
            onChange={(e) => onParamChange('size', Number(e.target.value))}
            className="w-full accent-[#ff8a00] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-auto">
        <button
          onClick={toggleEraser}
          className={`
            flex flex-col items-center justify-center p-2 rounded-lg transition-all
            ${
              erasing
                ? 'bg-gradient-to-br from-[#ff3333] to-[#cc0000] text-white'
                : 'bg-[#24243e] hover:bg-[#343256] text-gray-300'
            }
          `}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        <button
          onClick={onClear}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#24243e] hover:bg-[#343256] text-gray-300 transition-all"
          title="Clear"
        >
          <Trash2 size={20} />
        </button>
         <button
          onClick={onSave}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#24243e] hover:bg-[#343256] text-gray-300 transition-all"
          title="Save PNG"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onUndo}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#24243e] hover:bg-[#343256] text-gray-300 transition-all"
          title="Undo"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={onRedo}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#24243e] hover:bg-[#343256] text-gray-300 transition-all"
          title="Redo"
        >
          <Redo size={20} />
        </button>
      </div>
    </div>
  );
};

export default Controls;