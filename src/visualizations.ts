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

export function drawLineChart(container: HTMLElement, values: number[], title: string) {
  const x = values.map((_, i) => i / (values.length - 1));
  
  const trace = {
    x: x,
    y: values,
    type: 'scatter',
    mode: 'lines',
    line: {
      color: '#2166ac',
      width: 2
    },
    name: title
  };
  
  // Calculate reasonable y-axis range
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 0);
  const rawRange = maxVal - minVal;
  const minRange = Math.max(rawRange, Math.abs(maxVal) * 0.1, Math.abs(minVal) * 0.1, 1);
  
  const center = (maxVal + minVal) / 2;
  const halfRange = minRange / 2;
  const yMin = center - halfRange;
  const yMax = center + halfRange;
  
  const layout = {
    xaxis: {
      title: 'Position',
      range: [0, 1],
      showgrid: true,
      zeroline: false
    },
    yaxis: {
      title: title,
      range: [yMin, yMax],
      showgrid: true,
      zeroline: true,
      zerolinecolor: '#999',
      zerolinewidth: 1
    },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { size: 10 },
    showlegend: false
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot(container, [trace], layout, config);
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