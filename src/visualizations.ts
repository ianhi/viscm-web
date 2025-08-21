import { RGB, ColorMap } from './types';
import { simulate } from '@bjornlu/colorblind';
import * as Plotly from 'plotly.js-dist';
import * as d3Scale from 'd3-scale';
import Color from 'colorjs.io';
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
  
  // Create colors array matching the coordinates
  const colors = colormap.colors.map(c => 
    `rgb(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)})`
  );
  
  const trace = {
    type: 'scatter3d',
    mode: 'lines+markers',
    x: coords.x,
    y: coords.y,
    z: coords.z,
    line: {
      color: colors,
      width: 3
    },
    marker: {
      size: 3,
      color: colors,
      line: {
        color: 'rgba(0,0,0,0.1)',
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
  
  // Create imageData directly for better control
  const imageData = ctx.createImageData(width, height);
  
  // Create a more sophisticated test pattern with mathematical functions
  // This creates interesting structures that test colormap performance
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      
      // Normalize coordinates to 0-1
      const nx = x / (width - 1);
      const ny = y / (height - 1);
      
      // Create a complex pattern using multiple mathematical functions
      // This tests how well the colormap preserves structure
      const pattern1 = Math.sin(nx * Math.PI * 4) * Math.cos(ny * Math.PI * 4);
      const pattern2 = Math.exp(-((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * 8);
      const pattern3 = Math.sin(nx * ny * Math.PI * 8);
      
      // Combine patterns and normalize to 0-1
      const value = (pattern1 * 0.4 + pattern2 * 0.4 + pattern3 * 0.2 + 1) / 2;
      const intensity = Math.max(0, Math.min(1, value)) * 255;
      
      imageData.data[pixelIndex] = intensity;     // R
      imageData.data[pixelIndex + 1] = intensity; // G
      imageData.data[pixelIndex + 2] = intensity; // B
      imageData.data[pixelIndex + 3] = 255;       // A
    }
  }
  
  return imageData;
}

export function applyColormapToImage(imageData: ImageData, colormap: ColorMap): ImageData {
  const result = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  // Create a d3 scale for mapping intensity to colormap
  const scale = d3Scale.scaleLinear<RGB>()
    .domain([0, 1])
    .range([colormap.colors[0], colormap.colors[colormap.colors.length - 1]])
    .interpolate(() => (t: number) => {
      const index = Math.round(t * (colormap.colors.length - 1));
      return colormap.colors[Math.min(index, colormap.colors.length - 1)];
    });
  
  for (let i = 0; i < result.data.length; i += 4) {
    // Use color.js for proper RGB to grayscale conversion
    const c = new Color('srgb', [
      result.data[i] / 255,
      result.data[i + 1] / 255,
      result.data[i + 2] / 255
    ]);
    const lab = c.to('lab');
    const gray = lab.coords[0] / 100; // L* normalized to 0-1
    
    // Map to colormap using d3 scale
    const color = scale(gray);
    
    result.data[i] = Math.round(color.r * 255);
    result.data[i + 1] = Math.round(color.g * 255);
    result.data[i + 2] = Math.round(color.b * 255);
  }
  
  return result;
}