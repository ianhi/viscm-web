import Color from 'colorjs.io';
import * as ss from 'simple-statistics';
import * as d3 from 'd3-array';
import { RGB, PerceptualStats } from './types';

export function rgbToLab(color: RGB): [number, number, number] {
  const c = new Color('srgb', [color.r, color.g, color.b]);
  const lab = c.to('lab');
  return [lab.coords[0], lab.coords[1], lab.coords[2]];
}

export function calculateDeltaE(color1: RGB, color2: RGB, method: string = '2000'): number {
  const c1 = new Color('srgb', [color1.r, color1.g, color1.b]);
  const c2 = new Color('srgb', [color2.r, color2.g, color2.b]);
  
  // Use specific deltaE method from color.js
  switch (method) {
    case '76':
      return c1.deltaE76(c2);
    case 'CMC':
      return c1.deltaECMC(c2);
    case '2000':
      return c1.deltaE2000(c2);
    case 'ITP':
      return c1.deltaEITP(c2);
    case 'Jz':
      return c1.deltaEJz(c2);
    default:
      return c1.deltaE2000(c2); // Default to deltaE 2000
  }
}

export function calculatePerceptualDeltas(colors: RGB[], method: string = '2000'): number[] {
  // Use d3.pairs to create adjacent pairs, then map to specified deltaE method
  return d3.pairs(colors).map(([color1, color2]) => calculateDeltaE(color1, color2, method));
}

export function calculateLightnessDeltas(colors: RGB[]): number[] {
  // Convert to grayscale version first, then calculate signed lightness differences
  const grayscaleColors = toGrayscale(colors);
  return d3.pairs(grayscaleColors).map(([color1, color2]) => {
    const c1 = new Color('srgb', [color1.r, color1.g, color1.b]);
    const c2 = new Color('srgb', [color2.r, color2.g, color2.b]);
    
    // Get L* values directly for signed difference
    const lab1 = c1.to('lab');
    const lab2 = c2.to('lab');
    
    // Return signed difference: positive = getting lighter, negative = getting darker
    return lab2.coords[0] - lab1.coords[0];
  });
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