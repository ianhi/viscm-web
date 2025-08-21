import { RGB, ColorMap } from './types';
import { simulate } from '@bjornlu/colorblind';
import * as Plotly from 'plotly.js-dist';
import { getLab3DCoordinates } from './analysis';

export function drawColormapStrip(canvas: HTMLCanvasElement, colors: RGB[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  const stepWidth = width / colors.length;
  
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    ctx.fillStyle = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
    ctx.fillRect(i * stepWidth, 0, stepWidth + 1, height);
  }
}

export function drawLineChart(canvas: HTMLCanvasElement, values: number[], label?: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;
  
  ctx.clearRect(0, 0, width, height);
  
  // Draw axes
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();
  
  // Draw zero line if we have negative values
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 0);
  const range = maxVal - minVal || 1;
  
  if (minVal < 0) {
    const zeroY = height - padding - ((-minVal / range) * (height - 2 * padding));
    ctx.strokeStyle = '#999';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  // Draw the line
  ctx.strokeStyle = '#2166ac';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i < values.length; i++) {
    const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((values[i] - minVal) / range) * (height - 2 * padding);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Draw label if provided
  if (label) {
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText(label, padding + 5, padding - 5);
  }
}

export function drawColorBlindSimulation(
  canvas: HTMLCanvasElement, 
  colors: RGB[], 
  type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
) {
  const simulatedColors = colors.map(color => {
    const rgb = {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255)
    };
    
    const simulated = simulate(rgb, type);
    return {
      r: simulated.r / 255,
      g: simulated.g / 255,
      b: simulated.b / 255
    };
  });
  
  drawColormapStrip(canvas, simulatedColors);
}

export function draw3DColorSpace(container: HTMLElement, colormap: ColorMap) {
  const coords = getLab3DCoordinates(colormap.colors);
  
  // Sample fewer points for the 3D plot to improve performance
  const step = Math.max(1, Math.floor(colormap.colors.length / 50));
  const sampledIndices = Array.from({ length: Math.ceil(colormap.colors.length / step) }, 
    (_, i) => Math.min(i * step, colormap.colors.length - 1));
  
  const trace = {
    type: 'scatter3d',
    mode: 'lines+markers',
    x: coords.x,
    y: coords.y,
    z: coords.z,
    line: {
      color: sampledIndices.map(i => {
        const c = colormap.colors[i];
        return `rgb(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)})`;
      }),
      width: 4
    },
    marker: {
      size: sampledIndices.map(i => i === 0 || i === colormap.colors.length - 1 ? 8 : 4),
      color: sampledIndices.map(i => {
        const c = colormap.colors[i];
        return `rgb(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)})`;
      }),
      line: {
        color: 'black',
        width: 0.5
      }
    }
  };
  
  const layout = {
    scene: {
      xaxis: { title: 'a* (green-red)', range: [-100, 100] },
      yaxis: { title: 'b* (blue-yellow)', range: [-100, 100] },
      zaxis: { title: 'L* (lightness)', range: [0, 100] },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot(container, [trace], layout, config);
}

export function generateTestPattern(width: number, height: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Create a simple test pattern with gradients and shapes
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(1, '#fff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some circles
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const x = (i + 0.5) * (width / 5);
      const y = (j + 0.5) * (height / 5);
      const intensity = (i * 5 + j) / 24;
      
      ctx.beginPath();
      ctx.arc(x, y, width / 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${intensity * 255}, ${intensity * 255}, ${intensity * 255}, 1)`;
      ctx.fill();
    }
  }
  
  return ctx.getImageData(0, 0, width, height);
}

export function applyColormapToImage(imageData: ImageData, colormap: ColorMap): ImageData {
  const result = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  for (let i = 0; i < result.data.length; i += 4) {
    // Convert to grayscale
    const gray = (result.data[i] * 0.299 + result.data[i + 1] * 0.587 + result.data[i + 2] * 0.114) / 255;
    
    // Map to colormap
    const index = Math.floor(gray * (colormap.colors.length - 1));
    const color = colormap.colors[index];
    
    result.data[i] = Math.round(color.r * 255);
    result.data[i + 1] = Math.round(color.g * 255);
    result.data[i + 2] = Math.round(color.b * 255);
  }
  
  return result;
}