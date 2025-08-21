import Color from 'colorjs.io';
import { RGB, PerceptualStats } from './types';

export function rgbToLab(color: RGB): [number, number, number] {
  const c = new Color('srgb', [color.r, color.g, color.b]);
  const lab = c.to('lab');
  return [lab.coords[0], lab.coords[1], lab.coords[2]];
}

export function calculateDeltaE(color1: RGB, color2: RGB): number {
  const c1 = new Color('srgb', [color1.r, color1.g, color1.b]);
  const c2 = new Color('srgb', [color2.r, color2.g, color2.b]);
  // Use deltaE 2000 for most accurate perceptual difference
  return c1.deltaE(c2, '2000');
}

export function calculatePerceptualDeltas(colors: RGB[]): number[] {
  const deltas: number[] = [];
  for (let i = 1; i < colors.length; i++) {
    deltas.push(calculateDeltaE(colors[i - 1], colors[i]));
  }
  return deltas;
}

export function calculateLightnessDeltas(colors: RGB[]): number[] {
  const deltas: number[] = [];
  for (let i = 1; i < colors.length; i++) {
    const [l1] = rgbToLab(colors[i - 1]);
    const [l2] = rgbToLab(colors[i]);
    deltas.push(l2 - l1);
  }
  return deltas;
}

export function calculateStats(deltas: number[]): PerceptualStats {
  const totalLength = deltas.reduce((sum, d) => sum + Math.abs(d), 0);
  const mean = totalLength / deltas.length;
  const variance = deltas.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / deltas.length;
  const rmsDeviation = Math.sqrt(variance);
  
  return {
    totalLength,
    rmsDeviation,
    maxDelta: Math.max(...deltas),
    minDelta: Math.min(...deltas)
  };
}

export function toGrayscale(colors: RGB[]): RGB[] {
  return colors.map(color => {
    const c = new Color('srgb', [color.r, color.g, color.b]);
    const lab = c.to('lab');
    // Create grayscale by setting a* and b* to 0, keeping L* (lightness)
    const gray = new Color('lab', [lab.coords[0], 0, 0]);
    const srgb = gray.to('srgb');
    return { 
      r: Math.max(0, Math.min(1, srgb.coords[0])), 
      g: Math.max(0, Math.min(1, srgb.coords[1])), 
      b: Math.max(0, Math.min(1, srgb.coords[2])) 
    };
  });
}

export function getLab3DCoordinates(colors: RGB[]): { x: number[], y: number[], z: number[] } {
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  
  for (const color of colors) {
    const [l, a, b] = rgbToLab(color);
    x.push(a);
    y.push(b);
    z.push(l);
  }
  
  return { x, y, z };
}