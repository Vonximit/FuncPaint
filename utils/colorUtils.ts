import { PaintParams } from '../types';

export function hexToRGBA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getRainbowColor(alpha: number, hueShift: number, rainbowSpeed: number) {
  // Use Date.now() for time-based shifting, adjusted by rainbowSpeed
  // Speed 5 is standard (divisor ~600), Speed 10 is fast (divisor 100).
  const timeDivisor = 1100 - (rainbowSpeed * 100);
  const time = Date.now() / timeDivisor;
  const hue = (time * 360 + hueShift) % 360;
  return `hsla(${hue}, 100%, 60%, ${alpha})`;
}

export function getColor(
  params: PaintParams, 
  style: 'primary' | 'secondary' = 'primary', 
  alpha: number = 1, 
  hueShift: number = 0
) {
  if (params.rainbowMode) {
    return getRainbowColor(alpha, hueShift, params.rainbowSpeed);
  }
  
  const hex = style === 'primary' ? params.primaryColor : params.secondaryColor;
  return hexToRGBA(hex, alpha);
}