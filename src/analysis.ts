import Color from 'colorjs.io';
import * as ss from 'simple-statistics';
import * as d3 from 'd3-array';
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
  // Use d3.pairs to create adjacent pairs, then map to deltaE
  return d3.pairs(colors).map(([color1, color2]) => calculateDeltaE(color1, color2));
}

export function calculateLightnessDeltas(colors: RGB[]): number[] {
  // Convert to lightness values first, then use d3.pairs for differences
  const lightness = colors.map(color => rgbToLab(color)[0]);
  return d3.pairs(lightness).map(([l1, l2]) => l2 - l1);
}

export function calculateStats(deltas: number[]): PerceptualStats {
  const absDeltas = deltas.map(d => Math.abs(d));
  
  return {
    totalLength: d3.sum(absDeltas),
    rmsDeviation: ss.rootMeanSquare(deltas),
    maxDelta: d3.max(deltas) ?? 0,
    minDelta: d3.min(deltas) ?? 0
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
  const coords = colors.map(color => rgbToLab(color));
  
  return {
    x: coords.map(([, a]) => a),  // a* values
    y: coords.map(([, , b]) => b), // b* values
    z: coords.map(([l]) => l)      // L* values
  };
}