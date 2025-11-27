export enum PaintFunction {
  DrawSpiral = 'drawSpiral',
  EmitPulse = 'emitPulse',
  ExpandHalo = 'expandHalo',
  Coagulate = 'coagulate',
  BreatheSync = 'breatheSync',
  OverlayCosmos = 'overlayCosmos',
  RandomStars = 'randomStars',
  CurveSpace = 'curveSpace',
  HeartBeat = 'heartBeat',
  // Pro Pack
  ForceField = 'forceField',
  SacredGeometry = 'sacredGeometry',
  SoundWaves = 'soundWaves',
  NeuralNetwork = 'neuralNetwork',
  Vortex = 'vortex',
  CrystalForm = 'crystalForm',
  FluidDynamics = 'fluidDynamics',
  BinaryCode = 'binaryCode',
  SpiralGalaxy = 'spiralGalaxy',
  FractalTree = 'fractalTree',
  // Traditional Pack
  FreeDraw = 'freeDraw',
  DrawLine = 'drawLine',
  DrawRectangle = 'drawRectangle',
  DrawCircle = 'drawCircle',
  DrawTriangle = 'drawTriangle',
  DrawPolygon = 'drawPolygon',
  SprayPaint = 'sprayPaint',
  FillArea = 'fillArea',
  // Text Pack
  WriteText = 'writeText',
  // Math Pack
  FunctionPlot = 'functionPlot',
  ParametricCurve = 'parametricCurve',
  PolarPlot = 'polarPlot',
  VectorField = 'vectorField',
}

export enum DemoType {
  None = 'none',
  Random = 'random',
  Landscape = 'landscape',
  Portrait = 'portrait',
}

export type FillMode = 'stroke' | 'fill' | 'both';
export type TextEffect = 'normal' | 'glow' | 'neon' | 'hologram' | 'matrix' | 'gradient' | 'outline' | 'cyber';
export type FunctionType = 'cartesian' | 'parametric' | 'polar' | 'vector';

export interface PaintParams {
  intensity: number;
  size: number;
  speed: number;
  // Color System
  primaryColor: string;
  secondaryColor: string;
  rainbowMode: boolean;
  rainbowSpeed: number;
  // Traditional System
  lineWidth: number;
  fillMode: FillMode;
  smoothDrawing: boolean;
  // Text System
  text: string;
  font: string;
  fontSize: number;
  textEffect: TextEffect;
  textRainbow: boolean;
  // Math System
  mathFunction: string;
  xRange: number;
  resolution: number;
  functionType: FunctionType;
}

export interface Point {
  x: number;
  y: number;
}