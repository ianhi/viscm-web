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
  
  const layout = {
    xaxis: {
      title: 'Position',
      range: [0, 1],
      showgrid: true,
      zeroline: false
    },
    yaxis: {
      title: title,
      showgrid: true,
      zeroline: true,
      zerolinecolor: '#999',
      zerolinewidth: 1
    },
    margin: { l: 40, r: 10, t: 10, b: 30 },
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
  
  // Calculate ranges with minimum sizes to avoid noisy plots
  const minAxisRange = 20; // Minimum range for any axis
  
  const xRange: [number, number] = [Math.min(...coords.x), Math.max(...coords.x)];
  const yRange: [number, number] = [Math.min(...coords.y), Math.max(...coords.y)];
  const zRange: [number, number] = [Math.min(...coords.z), Math.max(...coords.z)];
  
  // Expand ranges if they're too small
  function ensureMinRange(range: [number, number], minRange: number): [number, number] {
    const currentRange = range[1] - range[0];
    if (currentRange < minRange) {
      const center = (range[0] + range[1]) / 2;
      const halfMinRange = minRange / 2;
      return [center - halfMinRange, center + halfMinRange];
    }
    return range;
  }
  
  const adjustedXRange = ensureMinRange(xRange, minAxisRange);
  const adjustedYRange = ensureMinRange(yRange, minAxisRange);
  const adjustedZRange = ensureMinRange(zRange, minAxisRange);
  
  const layout = {
    scene: {
      xaxis: { 
        title: 'a* (green-red)',
        range: adjustedXRange
      },
      yaxis: { 
        title: 'b* (blue-yellow)',
        range: adjustedYRange
      },
      zaxis: { 
        title: 'L* (lightness)',
        range: adjustedZRange
      },
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
      
      // Create a sine wave pattern that exercises the full 0-1 range
      // Combined horizontal and vertical sine waves for interesting structure
      const sineX = Math.sin(nx * Math.PI * 6);
      const sineY = Math.sin(ny * Math.PI * 4);
      const radial = Math.sin(Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2) * Math.PI * 8);
      
      // Combine patterns to create full 0-1 range coverage
      const combined = (sineX * 0.4 + sineY * 0.4 + radial * 0.2);
      // Map from [-1, 1] to [0, 1] to ensure full colormap range is used
      const value = (combined + 1) / 2;
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