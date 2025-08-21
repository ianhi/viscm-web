import chroma from 'chroma-js';
import { RGB, PerceptualStats } from './types';
import * as d3 from 'd3-color';

export function rgbToLab(color: RGB): [number, number, number] {
  const c = chroma(color.r * 255, color.g * 255, color.b * 255);
  return c.lab();
}

export function calculateDeltaE(color1: RGB, color2: RGB): number {
  const c1 = chroma(color1.r * 255, color1.g * 255, color1.b * 255);
  const c2 = chroma(color2.r * 255, color2.g * 255, color2.b * 255);
  return chroma.deltaE(c1, c2);
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
    const c = chroma(color.r * 255, color.g * 255, color.b * 255);
    const [l] = c.lab();
    const gray = chroma.lab(l, 0, 0);
    const [r, g, b] = gray.rgb();
    return { r: r / 255, g: g / 255, b: b / 255 };
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