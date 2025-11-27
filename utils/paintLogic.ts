import { PaintFunction, PaintParams, Point, TextEffect } from '../types';
import { getColor, getRainbowColor, hexToRGBA } from './colorUtils';

// Helper to convert speed to time scale
export const getTimeScale = (speed: number) => 0.5 + speed / 5;

// Convert HEX to RGB Object
function hexToRGB(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export const executePaintFunction = (
  ctx: CanvasRenderingContext2D,
  func: PaintFunction,
  x: number,
  y: number,
  params: PaintParams,
  timeScale: number
) => {
  const { size, intensity } = params;

  switch (func) {
    case PaintFunction.DrawSpiral:
      drawSpiral(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.EmitPulse:
      emitPulse(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.ExpandHalo:
      expandHalo(ctx, x, y, size, timeScale, params);
      break;
    case PaintFunction.Coagulate:
      coagulate(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.BreatheSync:
      breatheSync(ctx, x, y, size, timeScale, params);
      break;
    case PaintFunction.OverlayCosmos:
      overlayCosmos(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.RandomStars:
      randomStars(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.CurveSpace:
      curveSpace(ctx, x, y, size, timeScale, params);
      break;
    case PaintFunction.HeartBeat:
      heartBeat(ctx, x, y, size, timeScale, params);
      break;
    // Pro Pack
    case PaintFunction.ForceField:
      forceField(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.SacredGeometry:
      sacredGeometry(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.SoundWaves:
      soundWaves(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.NeuralNetwork:
      neuralNetwork(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.Vortex:
      vortex(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.CrystalForm:
      crystalForm(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.FluidDynamics:
      fluidDynamics(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.BinaryCode:
      binaryCode(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.SpiralGalaxy:
      spiralGalaxy(ctx, x, y, size, intensity, timeScale, params);
      break;
    case PaintFunction.FractalTree:
      fractalTree(ctx, x, y, size, intensity, params);
      break;
    // Traditional Pack - Instant tools
    case PaintFunction.SprayPaint:
      sprayPaint(ctx, x, y, size, intensity, params);
      break;
    case PaintFunction.FillArea:
      fillArea(ctx, x, y, params);
      break;
    // Text Pack
    case PaintFunction.WriteText:
      writeText(ctx, x, y, params);
      break;
    // Math Pack
    case PaintFunction.FunctionPlot:
      functionPlot(ctx, x, y, params);
      break;
    case PaintFunction.ParametricCurve:
      parametricCurve(ctx, x, y, params);
      break;
    case PaintFunction.PolarPlot:
      polarPlot(ctx, x, y, params);
      break;
    case PaintFunction.VectorField:
      vectorField(ctx, x, y, params);
      break;
  }
};

// --- Math Functions ---

const drawCoordinateAxes = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, params: PaintParams) => {
    ctx.strokeStyle = getColor(params, 'secondary', 0.3);
    ctx.lineWidth = 1;
    
    // X Axis
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY);
    ctx.lineTo(centerX + size, centerY);
    ctx.stroke();
    
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size);
    ctx.lineTo(centerX, centerY + size);
    ctx.stroke();
    
    // Marks
    const markSpacing = size / 5;
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        
        // X Marks
        ctx.beginPath();
        ctx.moveTo(centerX + i * markSpacing, centerY - 3);
        ctx.lineTo(centerX + i * markSpacing, centerY + 3);
        ctx.stroke();
        
        // Y Marks
        ctx.beginPath();
        ctx.moveTo(centerX - 3, centerY + i * markSpacing);
        ctx.lineTo(centerX + 3, centerY + i * markSpacing);
        ctx.stroke();
    }
};

const safeEval = (code: string, vars: Record<string, any>): number => {
    try {
        const keys = Object.keys(vars);
        const values = Object.values(vars);
        // Create a function with the variable names as arguments
        const func = new Function(...keys, `return ${code};`);
        return func(...values);
    } catch (e) {
        // console.error("Math eval error:", e);
        return 0;
    }
};

const functionPlot = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    const { xRange, resolution, size, mathFunction } = params;
    const scale = size / xRange;
    const step = (xRange * 2) / resolution;
    
    drawCoordinateAxes(ctx, x, y, size, params);
    
    ctx.beginPath();
    
    for (let i = -resolution/2; i <= resolution/2; i++) {
        const graphX = i * step;
        const graphY = safeEval(mathFunction, { x: graphX, Math });
        
        const canvasX = x + graphX * scale;
        const canvasY = y - graphY * scale;
        
        if (i === -resolution/2) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.strokeStyle = getColor(params, 'primary', 1);
    ctx.lineWidth = params.lineWidth;
    ctx.stroke();
};

const parametricCurve = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    const { resolution, size, mathFunction } = params;
    const scale = size / 10; // Default scale factor for parametric
    const tMax = Math.PI * 2;
    const step = tMax / resolution;
    
    drawCoordinateAxes(ctx, x, y, size, params);
    
    ctx.beginPath();
    
    const parts = mathFunction.split(',');
    if (parts.length < 2) return;
    const funcX = parts[0];
    const funcY = parts[1];

    for (let t = 0; t <= tMax; t += step) {
        const paramX = safeEval(funcX, { t, Math });
        const paramY = safeEval(funcY, { t, Math });
        
        const canvasX = x + paramX * scale;
        const canvasY = y - paramY * scale;
        
        if (t === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.strokeStyle = getColor(params, 'primary', 1);
    ctx.lineWidth = params.lineWidth;
    ctx.stroke();
};

const polarPlot = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    const { resolution, size, mathFunction } = params;
    const scale = size / 10;
    const thetaMax = Math.PI * 2;
    const step = thetaMax / resolution;
    
    drawCoordinateAxes(ctx, x, y, size, params);
    
    ctx.beginPath();
    
    for (let theta = 0; theta <= thetaMax; theta += step) {
        const radius = safeEval(mathFunction, { theta, t: theta, Math });
        
        const graphX = radius * Math.cos(theta);
        const graphY = radius * Math.sin(theta);
        
        const canvasX = x + graphX * scale;
        const canvasY = y - graphY * scale;
        
        if (theta === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.strokeStyle = getColor(params, 'primary', 1);
    ctx.lineWidth = params.lineWidth;
    ctx.stroke();
};

const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, params: PaintParams) => {
    const headLength = 10;
    const headAngle = Math.PI / 6;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.strokeStyle = getColor(params, 'primary', 0.8);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle - headAngle),
        toY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
        toX - headLength * Math.cos(angle + headAngle),
        toY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fillStyle = getColor(params, 'primary', 0.8);
    ctx.fill();
};

const vectorField = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    const { size, mathFunction } = params;
    const gridSize = 8;
    const cellSize = size / gridSize;
    const scale = 0.1;
    
    const parts = mathFunction.split(',');
    const funcX = parts[0] || "-y";
    const funcY = parts[1] || "x";

    for (let i = -gridSize/2; i <= gridSize/2; i++) {
        for (let j = -gridSize/2; j <= gridSize/2; j++) {
            const gridX = i * cellSize;
            const gridY = j * cellSize;
            
            const worldX = gridX / scale;
            const worldY = gridY / scale;
            
            let vectorX = safeEval(funcX, { x: worldX, y: worldY, Math });
            let vectorY = safeEval(funcY, { x: worldX, y: worldY, Math });

            // Normalize
            const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
            const normalizedX = vectorX / (length || 1);
            const normalizedY = vectorY / (length || 1);
            
            const arrowLength = cellSize * 0.3;
            
            const startX = x + gridX;
            const startY = y + gridY;
            const endX = startX + normalizedX * arrowLength;
            const endY = startY + normalizedY * arrowLength;
            
            drawArrow(ctx, startX, startY, endX, endY, params);
        }
    }
};


// --- Text Functions ---

const getTextColor = (params: PaintParams, alpha: number = 1, hueShift: number = 0) => {
    if (params.textRainbow) {
        const time = Date.now() / 1000;
        const hue = (time * 360 + hueShift) % 360;
        return `hsla(${hue}, 100%, 60%, ${alpha})`;
    }
    return getColor(params, 'primary', alpha, hueShift);
};

const writeText = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    if (!params.text || params.text.trim() === "") return;
    
    // Scale font size based on the generic 'size' param slightly to allow some dynamic variation, 
    // or strictly use fontSize. The prompt implies using params.fontSize directly.
    const finalFontSize = params.fontSize; // * (params.size / 50); 
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${finalFontSize}px "${params.font}"`;
    
    applyTextEffect(ctx, params.text, x, y, finalFontSize, params);
};

const applyTextEffect = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, params: PaintParams) => {
    switch(params.textEffect) {
        case 'glow':
            drawGlowText(ctx, text, x, y, params);
            break;
        case 'neon':
            drawNeonText(ctx, text, x, y, params);
            break;
        case 'hologram':
            drawHologramText(ctx, text, x, y, params);
            break;
        case 'matrix':
            drawMatrixText(ctx, text, x, y, fontSize, params);
            break;
        case 'gradient':
            drawGradientText(ctx, text, x, y, params);
            break;
        case 'outline':
            drawOutlineText(ctx, text, x, y, params);
            break;
        case 'cyber':
            drawCyberText(ctx, text, x, y, fontSize, params);
            break;
        default:
            drawNormalText(ctx, text, x, y, params);
    }
};

const drawNormalText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    ctx.fillStyle = getTextColor(params);
    ctx.fillText(text, x, y);
};

const drawGlowText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    ctx.shadowColor = getTextColor(params, 0.8);
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.fillStyle = getTextColor(params);
    ctx.fillText(text, x, y);
    
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
};

const drawNeonText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 3) * 0.3 + 0.7;
    
    ctx.shadowColor = getTextColor(params, 0.8);
    ctx.shadowBlur = 30 * pulse;
    
    ctx.strokeStyle = getTextColor(params, 0.9);
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
    
    ctx.fillStyle = getTextColor(params, 1);
    ctx.fillText(text, x, y);
    
    ctx.shadowBlur = 0;
};

const drawHologramText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    const time = Date.now() / 1000;
    
    for (let i = 0; i < 3; i++) {
        const scanY = y + Math.sin(time * 2 + i) * 5;
        const alpha = 0.3 - i * 0.1;
        
        ctx.fillStyle = getTextColor(params, alpha, i * 120);
        ctx.fillText(text, x + i * 2, scanY);
    }
    
    ctx.strokeStyle = getTextColor(params, 0.5, 180);
    ctx.lineWidth = 1;
    ctx.beginPath();
    const width = ctx.measureText(text).width;
    ctx.moveTo(x - width/2, y + Math.sin(time * 4) * 10);
    ctx.lineTo(x + width/2, y + Math.sin(time * 4) * 10);
    ctx.stroke();
};

const drawMatrixText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, params: PaintParams) => {
    const time = Date.now() / 1000;
    const chars = '010101010101';
    
    const width = ctx.measureText(text).width;

    // Falling chars bg
    for (let i = 0; i < text.length * 2; i++) {
        const charX = x - width/2 + (i * fontSize * 0.3);
        const fallSpeed = (time * 20 + i * 10) % 100;
        const charY = y - fontSize + fallSpeed;
        
        if (charY < y + fontSize) {
            ctx.fillStyle = `hsla(120, 100%, ${50 + fallSpeed}%, 0.7)`;
            ctx.fillText(chars[i % chars.length], charX, charY);
        }
    }
    
    ctx.fillStyle = '#00ff00';
    ctx.fillText(text, x, y);
};

const drawGradientText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    const width = ctx.measureText(text).width;
    const gradient = ctx.createLinearGradient(
        x - width/2, y,
        x + width/2, y
    );
    
    gradient.addColorStop(0, getTextColor(params, 1, 0));
    gradient.addColorStop(0.5, getTextColor(params, 1, 120));
    gradient.addColorStop(1, getTextColor(params, 1, 240));
    
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
};

const drawOutlineText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, params: PaintParams) => {
    for (let i = 3; i > 0; i--) {
        ctx.strokeStyle = getTextColor(params, 0.3, i * 60);
        ctx.lineWidth = i * 2;
        ctx.strokeText(text, x, y);
    }
    
    ctx.fillStyle = getTextColor(params);
    ctx.fillText(text, x, y);
};

const drawCyberText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, params: PaintParams) => {
    const time = Date.now() / 1000;
    const distortion = Math.sin(time * 5) * 2;
    
    for (let i = 0; i < 3; i++) {
        const offset = i * 2 + distortion;
        ctx.fillStyle = getTextColor(params, 0.6, i * 80);
        ctx.fillText(text, x + offset, y + offset);
    }
    
    ctx.strokeStyle = getTextColor(params, 0.8, 200);
    ctx.lineWidth = 1;
    
    const textWidth = ctx.measureText(text).width;
    ctx.beginPath();
    ctx.moveTo(x - textWidth/2 - 10, y - fontSize/2);
    ctx.lineTo(x + textWidth/2 + 10, y - fontSize/2);
    ctx.moveTo(x - textWidth/2 - 10, y + fontSize/2);
    ctx.lineTo(x + textWidth/2 + 10, y + fontSize/2);
    ctx.stroke();
};

// --- Traditional Functions (Shape Drawing & Free Draw) ---

export const freeDraw = (ctx: CanvasRenderingContext2D, points: Point[], params: PaintParams) => {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getColor(params, 'primary', 1);
    ctx.lineWidth = params.lineWidth;

    if (params.smoothDrawing && points.length >= 4) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.quadraticCurveTo(
            points[points.length - 2].x,
            points[points.length - 2].y,
            points[points.length - 1].x,
            points[points.length - 1].y
        );
    } else {
        const lastPoint = points[points.length - 1];
        const prevPoint = points[points.length - 2];
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(lastPoint.x, lastPoint.y);
    }
    
    ctx.stroke();
};

export const drawLine = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, params: PaintParams) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = getColor(params, 'primary', 1);
    ctx.lineWidth = params.lineWidth;
    ctx.stroke();
};

export const drawRectangle = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, params: PaintParams) => {
    const width = endX - startX;
    const height = endY - startY;
    
    if (params.fillMode === 'fill' || params.fillMode === 'both') {
        ctx.fillStyle = getColor(params, 'primary', 0.7);
        ctx.fillRect(startX, startY, width, height);
    }
    
    if (params.fillMode === 'stroke' || params.fillMode === 'both') {
        ctx.strokeStyle = getColor(params, 'secondary', 1);
        ctx.lineWidth = params.lineWidth;
        ctx.strokeRect(startX, startY, width, height);
    }
};

export const drawCircle = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, params: PaintParams) => {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    
    if (params.fillMode === 'fill' || params.fillMode === 'both') {
        ctx.fillStyle = getColor(params, 'primary', 0.7);
        ctx.fill();
    }
    
    if (params.fillMode === 'stroke' || params.fillMode === 'both') {
        ctx.strokeStyle = getColor(params, 'secondary', 1);
        ctx.lineWidth = params.lineWidth;
        ctx.stroke();
    }
};

export const drawTriangle = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, params: PaintParams) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(startX * 2 - endX, endY);
    ctx.closePath();
    
    if (params.fillMode === 'fill' || params.fillMode === 'both') {
        ctx.fillStyle = getColor(params, 'primary', 0.7);
        ctx.fill();
    }
    
    if (params.fillMode === 'stroke' || params.fillMode === 'both') {
        ctx.strokeStyle = getColor(params, 'secondary', 1);
        ctx.lineWidth = params.lineWidth;
        ctx.stroke();
    }
};

export const drawPolygon = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, params: PaintParams) => {
    const sides = Math.max(3, Math.floor(params.intensity / 2));
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
        const angle = (i * Math.PI * 2 / sides) - Math.PI / 2;
        const px = startX + Math.cos(angle) * radius;
        const py = startY + Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    
    if (params.fillMode === 'fill' || params.fillMode === 'both') {
        ctx.fillStyle = getColor(params, 'primary', 0.7);
        ctx.fill();
    }
    
    if (params.fillMode === 'stroke' || params.fillMode === 'both') {
        ctx.strokeStyle = getColor(params, 'secondary', 1);
        ctx.lineWidth = params.lineWidth;
        ctx.stroke();
    }
};

const sprayPaint = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
    const dots = 5 + Math.floor(intensity * 3);
    const spraySize = size * 0.5;
    
    for (let i = 0; i < dots; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spraySize;
        const dotX = x + Math.cos(angle) * distance;
        const dotY = y + Math.sin(angle) * distance;
        const dotSize = Math.random() * 3 + 1;
        const alpha = Math.random() * 0.5 + 0.3;
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = getColor(params, 'primary', alpha, i * 10);
        ctx.fill();
    }
};

const fillArea = (ctx: CanvasRenderingContext2D, x: number, y: number, params: PaintParams) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelPos = (Math.floor(y) * width + Math.floor(x)) * 4;
    
    const targetColor = {
        r: imageData.data[pixelPos],
        g: imageData.data[pixelPos + 1],
        b: imageData.data[pixelPos + 2],
        a: imageData.data[pixelPos + 3]
    };
    
    const fillColor = hexToRGB(params.primaryColor);
    const tolerance = 50;
    
    // Stack-based Flood Fill
    const stack = [[Math.floor(x), Math.floor(y)]];
    const visited = new Set();
    
    // Helper for color distance
    const colorDistance = (c1: any, c2: any) => {
        return Math.sqrt(
            Math.pow(c1.r - c2.r, 2) +
            Math.pow(c1.g - c2.g, 2) +
            Math.pow(c1.b - c2.b, 2)
        );
    };

    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop()!;
        const posKey = `${currentX},${currentY}`;
        
        if (visited.has(posKey)) continue;
        if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) continue;
        
        const currentPos = (currentY * width + currentX) * 4;
        const currentColor = {
            r: imageData.data[currentPos],
            g: imageData.data[currentPos + 1],
            b: imageData.data[currentPos + 2]
        };
        
        if (colorDistance(targetColor, currentColor) <= tolerance) {
            // Set pixel color
            imageData.data[currentPos] = fillColor.r;
            imageData.data[currentPos + 1] = fillColor.g;
            imageData.data[currentPos + 2] = fillColor.b;
            imageData.data[currentPos + 3] = 255; // Full alpha
            
            visited.add(posKey);
            
            stack.push([currentX + 1, currentY]);
            stack.push([currentX - 1, currentY]);
            stack.push([currentX, currentY + 1]);
            stack.push([currentX, currentY - 1]);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
};

// --- Standard Functions ---

const drawSpiral = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  ctx.beginPath();
  ctx.strokeStyle = getColor(params, 'primary', 1, 0); 
  ctx.lineWidth = 2;

  for (let i = 0; i < intensity * 10; i++) {
    const angle = 0.1 * i * timeScale;
    const radius = size * (1 - i / (intensity * 10));
    const posX = x + radius * Math.cos(angle);
    const posY = y + radius * Math.sin(angle);

    if (i === 0) ctx.moveTo(posX, posY);
    else ctx.lineTo(posX, posY);
  }
  ctx.stroke();
};

const emitPulse = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  const pulseSize = size * (intensity / 5);

  for (let i = 0; i < 3; i++) {
    const radius = pulseSize * (1 - i * 0.2);
    const alpha = 1 - i * 0.3;

    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'primary', alpha * 0.3, i * 20);
    ctx.fill();

    ctx.strokeStyle = getColor(params, 'secondary', alpha, i * 40);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const expandHalo = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const pulse = (Math.sin(time * 3) + 1) * 0.5;
  const radius = size * (0.5 + pulse * 0.5);

  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
  ctx.strokeStyle = getColor(params, 'secondary', 0.7, 0);
  ctx.lineWidth = 2;
  ctx.stroke();
};

const coagulate = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  const points = intensity * 5;

  for (let i = 0; i < points; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * size;
    const dotX = x + Math.cos(angle) * distance;
    const dotY = y + Math.sin(angle) * distance;
    const dotSize = Math.random() * 3 + 1;

    ctx.beginPath();
    ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'primary', 0.8, i * 5);
    ctx.fill();
  }
};

const breatheSync = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const breath = (Math.sin(time * 2) + 1) * 0.5;
  const radius = size * breath;

  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
  ctx.fillStyle = getColor(params, 'secondary', 0.3 + breath * 0.3, 0);
  ctx.fill();
};

const overlayCosmos = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  for (let i = 0; i < intensity * 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * size;
    const starX = x + Math.cos(angle) * distance;
    const starY = y + Math.sin(angle) * distance;
    const starSize = Math.random() * 2 + 0.5;

    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    ctx.fillStyle = params.rainbowMode ? getRainbowColor(1, i * 10, params.rainbowSpeed) : 'white';
    ctx.fill();
  }
};

const randomStars = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  for (let i = 0; i < intensity * 10; i++) {
    const starX = x + (Math.random() - 0.5) * size * 2;
    const starY = y + (Math.random() - 0.5) * size * 2;
    const starSize = Math.random() * 1.5 + 0.5;

    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
    if (params.rainbowMode) {
      ctx.fillStyle = getRainbowColor(0.8, i * 20, params.rainbowSpeed);
    } else {
      ctx.fillStyle = `hsl(${Math.random() * 60 + 200}, 100%, 80%)`;
    }
    ctx.fill();
  }
};

const curveSpace = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = i * ((Math.PI * 2) / 5) + time;
    const curveX = x + Math.cos(angle) * size;
    const curveY = y + Math.sin(angle) * size;

    if (i === 0) ctx.moveTo(curveX, curveY);
    else ctx.lineTo(curveX, curveY);
  }
  ctx.closePath();
  ctx.strokeStyle = getColor(params, 'primary', 0.7, 0);
  ctx.lineWidth = 2;
  ctx.stroke();
};

const heartBeat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const pulse = (Math.sin(time * 5) + 1) * 0.5;
  const beatSize = size * (0.8 + pulse * 0.4);

  ctx.beginPath();
  ctx.moveTo(x, y - beatSize * 0.8);
  ctx.bezierCurveTo(
    x + beatSize,
    y - beatSize,
    x + beatSize,
    y + beatSize * 0.6,
    x,
    y + beatSize
  );
  ctx.bezierCurveTo(
    x - beatSize,
    y + beatSize * 0.6,
    x - beatSize,
    y - beatSize,
    x,
    y - beatSize * 0.8
  );
  ctx.fillStyle = getColor(params, 'primary', 0.5 + pulse * 0.3, 0);
  ctx.fill();
};

// --- Pro Pack Functions ---

const forceField = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const points = intensity * 8;

  for (let i = 0; i < points; i++) {
    const angle = (i * Math.PI * 2 / points) + time;
    const distance = size * (0.3 + Math.sin(time + i) * 0.2);
    const fx = x + Math.cos(angle) * distance;
    const fy = y + Math.sin(angle) * distance;

    // Field Lines
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(fx, fy);
    ctx.strokeStyle = getColor(params, 'secondary', 0.6, angle * 180 / Math.PI);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Particles
    ctx.beginPath();
    ctx.arc(fx, fy, 2, 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'primary', 0.8, angle * 180 / Math.PI + 120);
    ctx.fill();
  }
};

const sacredGeometry = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const layers = Math.max(3, Math.floor(intensity / 2));

  for (let layer = 0; layer < layers; layer++) {
    const points = 6 + layer * 2;
    const layerSize = size * (0.3 + layer * 0.2);
    const rotation = time * (0.5 + layer * 0.1);

    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i * Math.PI * 2 / points) + rotation;
      const px = x + Math.cos(angle) * layerSize;
      const py = y + Math.sin(angle) * layerSize;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.strokeStyle = getColor(params, 'primary', 0.9 - layer * 0.2, layer * 40 + time * 50);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const soundWaves = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const waves = intensity * 2;

  for (let i = 0; i < waves; i++) {
    const waveSize = size * (0.5 + i * 0.3);
    const pulse = Math.sin(time * 3 - i) * 0.5 + 0.5;
    const alpha = 0.8 - i * 0.2;

    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, waveSize * pulse), 0, Math.PI * 2);
    ctx.strokeStyle = getColor(params, 'secondary', alpha, i * 60 + time * 100);
    ctx.lineWidth = 3;
    ctx.stroke();

    // Distortion Effect
    if (i % 2 === 0) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const distortion = Math.sin(a * 8 + time * 5) * 5;
        const radius = waveSize * pulse + distortion;
        const px = x + Math.cos(a) * radius;
        const py = y + Math.sin(a) * radius;

        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = getColor(params, 'primary', alpha * 0.5, i * 60 + 180);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
};

const neuralNetwork = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const nodes = 6 + Math.floor(intensity * 2);
  const nodePositions: { x: number; y: number }[] = [];

  // Create nodes
  for (let i = 0; i < nodes; i++) {
    const angle = (i * Math.PI * 2 / nodes) + Math.random() * 0.5;
    const distance = size * (0.3 + Math.random() * 0.4);
    const nodeX = x + Math.cos(angle) * distance;
    const nodeY = y + Math.sin(angle) * distance;
    nodePositions.push({ x: nodeX, y: nodeY });

    // Draw node
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 4 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'primary', 0.9, i * 60);
    ctx.fill();
  }

  // Connect nodes
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() > 0.6) { // Random connection
        ctx.beginPath();
        ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
        ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
        ctx.strokeStyle = getColor(params, 'secondary', 0.4, (i + j) * 20);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Node activation
  const time = (Date.now() / 1000) * timeScale;
  nodePositions.forEach((node, i) => {
    const pulse = Math.sin(time * 2 + i) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = getColor(params, 'secondary', 0.3 + pulse * 0.4, i * 60);
    ctx.lineWidth = 2;
    ctx.stroke();
  });
};

const vortex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const layers = intensity * 3;

  for (let layer = 0; layer < layers; layer++) {
    const layerSize = size * (0.2 + layer * 0.15);
    const points = 50;
    const twist = time * 2 + layer * 0.5;

    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const angle = progress * Math.PI * 4 + twist;
      const radius = layerSize * progress;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.strokeStyle = getColor(params, 'primary', 0.8 - layer * 0.15, layer * 40 + time * 100);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const crystalForm = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const spikes = 6 + Math.floor(intensity * 3);
  const time = (Date.now() / 1000) * timeScale;

  for (let i = 0; i < spikes; i++) {
    const angle = (i * Math.PI * 2 / spikes) + time * 0.1;
    const spikeLength = size * (0.5 + Math.sin(time + i) * 0.3);
    const endX = x + Math.cos(angle) * spikeLength;
    const endY = y + Math.sin(angle) * spikeLength;

    // Main Crystal Line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = getColor(params, 'primary', 0.9, i * 60);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Branching
    for (let branch = 0; branch < 2; branch++) {
      const branchAngle = angle + (branch === 0 ? 0.3 : -0.3);
      const branchLength = spikeLength * 0.4;
      const branchX = endX + Math.cos(branchAngle) * branchLength;
      const branchY = endY + Math.sin(branchAngle) * branchLength;

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(branchX, branchY);
      ctx.strokeStyle = getColor(params, 'secondary', 0.7, i * 60 + 30);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Shining Tips
    ctx.beginPath();
    ctx.arc(endX, endY, 3, 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'primary', 1, i * 60);
    ctx.fill();
  }
};

const fluidDynamics = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const droplets = intensity * 4;

  for (let i = 0; i < droplets; i++) {
    const angle = (i * Math.PI * 2 / droplets) + time;
    const distance = size * (0.2 + Math.sin(time * 2 + i) * 0.15);
    const dropX = x + Math.cos(angle) * distance;
    const dropY = y + Math.sin(angle) * distance;
    const dropSize = 3 + Math.sin(time * 3 + i) * 2;

    // Main Droplet
    ctx.beginPath();
    ctx.arc(dropX, dropY, Math.max(0, dropSize), 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'secondary', 0.8, angle * 180 / Math.PI);
    ctx.fill();

    // Splash Effect
    for (let j = 0; j < 3; j++) {
      const splashAngle = angle + (j - 1) * 0.5;
      const splashDist = dropSize * 1.5;
      const splashX = dropX + Math.cos(splashAngle) * splashDist;
      const splashY = dropY + Math.sin(splashAngle) * splashDist;
      const splashSize = dropSize * 0.3;

      ctx.beginPath();
      ctx.arc(splashX, splashY, Math.max(0, splashSize), 0, Math.PI * 2);
      ctx.fillStyle = getColor(params, 'primary', 0.6, angle * 180 / Math.PI + 30);
      ctx.fill();
    }
  }

  // Concentric Waves
  for (let wave = 0; wave < 3; wave++) {
    const waveSize = size * (0.3 + wave * 0.2);
    const pulse = Math.sin(time * 2 - wave) * 0.5 + 0.5;

    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, waveSize * pulse), 0, Math.PI * 2);
    ctx.strokeStyle = getColor(params, 'secondary', 0.4 - wave * 0.1, 200);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};

const binaryCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  const bits = 8 + Math.floor(intensity * 4);
  const time = Date.now() / 1000;

  for (let i = 0; i < bits; i++) {
    for (let j = 0; j < bits; j++) {
      const bitX = x + (i - bits / 2) * 8;
      const bitY = y + (j - bits / 2) * 8;

      // Random bit changing over time
      const bitValue = Math.floor((Math.sin(time + i + j) + 1) * 0.5);
      const alpha = 0.3 + Math.sin(time * 3 + i + j) * 0.3;

      if (params.rainbowMode) {
        ctx.fillStyle = bitValue === 1 
          ? getRainbowColor(alpha, i*10, params.rainbowSpeed) 
          : getRainbowColor(alpha * 0.5, i*10 + 180, params.rainbowSpeed);
      } else {
        ctx.fillStyle = bitValue === 1 ?
        hexToRGBA(params.primaryColor, alpha) :
        hexToRGBA(params.secondaryColor, alpha * 0.5);
      }

      ctx.fillRect(bitX, bitY, 4, 4);

      // Connections between active bits
      if (bitValue === 1 && i < bits - 1 && j < bits - 1) {
        const nextBit = Math.floor((Math.sin(time + i + 1 + j) + 1) * 0.5);
        if (nextBit === 1) {
          ctx.beginPath();
          ctx.moveTo(bitX + 2, bitY + 2);
          ctx.lineTo(bitX + 10, bitY + 2);
          ctx.strokeStyle = getColor(params, 'primary', alpha * 0.7, 0);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
};

const spiralGalaxy = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, timeScale: number, params: PaintParams) => {
  const time = (Date.now() / 1000) * timeScale;
  const arms = 2 + Math.floor(intensity / 3);
  const stars = intensity * 20;

  for (let arm = 0; arm < arms; arm++) {
    const armAngle = (arm * Math.PI * 2 / arms) + time * 0.1;

    for (let i = 0; i < stars; i++) {
      const progress = i / stars;
      const angle = armAngle + progress * Math.PI * 4;
      const distance = size * progress;
      const starSize = 1 + progress * 3;

      const starX = x + Math.cos(angle) * distance;
      const starY = y + Math.sin(angle) * distance;

      // Star
      ctx.beginPath();
      ctx.arc(starX, starY, Math.max(0, starSize), 0, Math.PI * 2);
      ctx.fillStyle = getColor(params, 'primary', 0.5 + progress * 0.3, progress * 360);
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(starX, starY, Math.max(0, starSize * 2), 0, Math.PI * 2);
      ctx.fillStyle = getColor(params, 'secondary', 0.1 + progress * 0.1, progress * 360);
      ctx.fill();
    }
  }

  // Core
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, size * 0.1), 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.1);
  
  if (params.rainbowMode) {
     gradient.addColorStop(0, getRainbowColor(1, 0, params.rainbowSpeed));
     gradient.addColorStop(1, getRainbowColor(0.3, 180, params.rainbowSpeed));
  } else {
     gradient.addColorStop(0, hexToRGBA(params.primaryColor, 1));
     gradient.addColorStop(1, hexToRGBA(params.secondaryColor, 0.3));
  }
  
  ctx.fillStyle = gradient;
  ctx.fill();
};

export const fractalTree = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, intensity: number, params: PaintParams) => {
  function drawBranch(startX: number, startY: number, length: number, angle: number, depth: number) {
    if (depth > intensity + 2) return;

    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    // Branch
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = getColor(params, 'secondary', 1 - depth * 0.2, 100 - depth * 20);
    ctx.lineWidth = Math.max(0.5, depth);
    ctx.stroke();

    // Recursion
    if (depth < intensity + 2) {
      const newLength = length * 0.7;
      drawBranch(endX, endY, newLength, angle - 0.5, depth + 1);
      drawBranch(endX, endY, newLength, angle + 0.5, depth + 1);

      // Extra branch for complexity
      if (depth % 2 === 0) {
        drawBranch(endX, endY, newLength * 0.8, angle + 0.2, depth + 1);
      }
    }

    // Leaves
    if (depth >= intensity + 1) {
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fillStyle = getColor(params, 'primary', 0.8, 120 - depth * 10);
      ctx.fill();
    }
  }

  drawBranch(x, y, size * 0.8, -Math.PI / 2, 0);
};