import './style.css';
import { colormaps, getColormap } from './colormaps';
import { 
  calculatePerceptualDeltas, 
  calculateLightnessDeltas, 
  calculateStats, 
  toGrayscale 
} from './analysis';
import {
  drawColormapStrip,
  drawLineChart,
  drawColorBlindSimulation,
  draw3DColorSpace,
  generateTestPattern,
  applyColormapToImage
} from './visualizations';

class ColormapVisualizer {
  private currentColormap = colormaps[0];
  
  constructor() {
    this.initializeUI();
    this.updateVisualization();
  }
  
  private initializeUI() {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    app.innerHTML = `
      <div class="header">
        <h1>Colormap Visualization</h1>
      </div>
      
      <div class="controls">
        <select id="colormap-select">
          ${colormaps.map(cm => `<option value="${cm.name}">${cm.name}</option>`).join('')}
        </select>
      </div>
      
      <div class="visualization-grid">
        <div class="viz-panel colormap-strip">
          <h3>Colormap</h3>
          <canvas id="colormap-canvas"></canvas>
        </div>
        
        <div class="viz-panel perceptual-delta">
          <h3>Perceptual Derivative (ΔE)</h3>
          <div id="perceptual-delta-plot" class="plot-container"></div>
          <div class="stats" id="perceptual-stats"></div>
        </div>
        
        <div class="viz-panel grayscale-strip">
          <h3>Grayscale</h3>
          <canvas id="grayscale-canvas"></canvas>
        </div>
        
        <div class="viz-panel lightness-delta">
          <h3>Lightness Derivative (ΔL*)</h3>
          <div id="lightness-delta-plot" class="plot-container"></div>
          <div class="stats" id="lightness-stats"></div>
        </div>
        
        <div class="viz-panel deuteranomaly">
          <h3>Deuteranomaly (50%)</h3>
          <canvas id="deuteranomaly-canvas"></canvas>
        </div>
        
        <div class="viz-panel deuteranopia">
          <h3>Deuteranopia (100%)</h3>
          <canvas id="deuteranopia-canvas"></canvas>
        </div>
        
        <div class="viz-panel protanomaly">
          <h3>Protanomaly (50%)</h3>
          <canvas id="protanomaly-canvas"></canvas>
        </div>
        
        <div class="viz-panel protanopia">
          <h3>Protanopia (100%)</h3>
          <canvas id="protanopia-canvas"></canvas>
        </div>
        
        <div class="viz-panel color-space-3d">
          <h3>L*a*b* Color Space</h3>
          <div id="color-space-plot" class="plot-container"></div>
        </div>
        
        <div class="viz-panel test-image-1">
          <h3>Test Pattern</h3>
          <canvas id="test-image-1"></canvas>
        </div>
        
        <div class="viz-panel test-image-1-cb">
          <h3>Test Pattern (Deuteranopia)</h3>
          <canvas id="test-image-1-cb"></canvas>
        </div>
        
        <div class="viz-panel test-image-2">
          <h3>Gradient Test</h3>
          <canvas id="test-image-2"></canvas>
        </div>
        
        <div class="viz-panel test-image-2-cb">
          <h3>Gradient Test (Deuteranopia)</h3>
          <canvas id="test-image-2-cb"></canvas>
        </div>
        
        <div class="viz-panel test-image-3">
          <h3>Sine Wave Pattern</h3>
          <canvas id="test-image-3"></canvas>
        </div>
        
        <div class="viz-panel test-image-3-cb">
          <h3>Sine Wave (Deuteranopia)</h3>
          <canvas id="test-image-3-cb"></canvas>
        </div>
      </div>
    `;
    
    // Add event listener
    const select = document.getElementById('colormap-select') as HTMLSelectElement;
    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const colormap = getColormap(target.value);
      if (colormap) {
        this.currentColormap = colormap;
        this.updateVisualization();
      }
    });
    
    // Setup canvases
    this.setupCanvases();
  }
  
  private setupCanvases() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width - 16;
      canvas.height = rect.height - 40;
    });
    
    // Handle resize
    let resizeTimeout: number | undefined;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.setupCanvases();
        this.updateVisualization();
      }, 250);
    });
  }
  
  private updateVisualization() {
    const colors = this.currentColormap.colors;
    
    // Draw colormap strip
    const colormapCanvas = document.getElementById('colormap-canvas') as HTMLCanvasElement;
    drawColormapStrip(colormapCanvas, colors);
    
    // Draw grayscale
    const grayscaleCanvas = document.getElementById('grayscale-canvas') as HTMLCanvasElement;
    const grayscaleColors = toGrayscale(colors);
    drawColormapStrip(grayscaleCanvas, grayscaleColors);
    
    // Calculate and draw perceptual deltas
    const perceptualDeltas = calculatePerceptualDeltas(colors);
    const perceptualPlot = document.getElementById('perceptual-delta-plot')!;
    drawLineChart(perceptualPlot, perceptualDeltas, 'ΔE');
    
    // Update perceptual stats
    const pStats = calculateStats(perceptualDeltas);
    const pStatsEl = document.getElementById('perceptual-stats')!;
    pStatsEl.innerHTML = `
      Length: ${pStats.totalLength.toFixed(1)}<br>
      RMS: ${pStats.rmsDeviation.toFixed(2)} (${(100 * pStats.rmsDeviation / pStats.totalLength).toFixed(1)}%)<br>
      <small>Points: ${perceptualDeltas.length}</small>
    `;
    
    // Calculate and draw lightness deltas
    const lightnessDeltas = calculateLightnessDeltas(colors);
    const lightnessPlot = document.getElementById('lightness-delta-plot')!;
    drawLineChart(lightnessPlot, lightnessDeltas, 'ΔL*');
    
    // Update lightness stats
    const lStats = calculateStats(lightnessDeltas);
    const lStatsEl = document.getElementById('lightness-stats')!;
    lStatsEl.innerHTML = `
      Length: ${lStats.totalLength.toFixed(1)}<br>
      RMS: ${lStats.rmsDeviation.toFixed(2)} (${(100 * lStats.rmsDeviation / lStats.totalLength).toFixed(1)}%)<br>
      <small>Points: ${lightnessDeltas.length}</small>
    `;
    
    // Draw color blindness simulations
    const deuteranomalyCanvas = document.getElementById('deuteranomaly-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(deuteranomalyCanvas, colors, 'deuteranopia');
    
    const deuteranopiaCanvas = document.getElementById('deuteranopia-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(deuteranopiaCanvas, colors, 'deuteranopia');
    
    const protanomalyCanvas = document.getElementById('protanomaly-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(protanomalyCanvas, colors, 'protanopia');
    
    const protanopiaCanvas = document.getElementById('protanopia-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(protanopiaCanvas, colors, 'protanopia');
    
    // Draw 3D color space
    const plotContainer = document.getElementById('color-space-plot')!;
    draw3DColorSpace(plotContainer, this.currentColormap);
    
    // Draw test images
    this.drawTestImages();
  }
  
  private drawTestImages() {
    // Test pattern 1
    const testCanvas1 = document.getElementById('test-image-1') as HTMLCanvasElement;
    const ctx1 = testCanvas1.getContext('2d')!;
    const testImage1 = generateTestPattern(testCanvas1.width, testCanvas1.height);
    const coloredImage1 = applyColormapToImage(testImage1, this.currentColormap);
    ctx1.putImageData(coloredImage1, 0, 0);
    
    // Test pattern 1 with color blindness
    const testCanvas1CB = document.getElementById('test-image-1-cb') as HTMLCanvasElement;
    const ctx1CB = testCanvas1CB.getContext('2d')!;
    // Apply colormap then simulate color blindness
    const imageData1CB = applyColormapToImage(testImage1, this.currentColormap);
    // Simple simulation by modifying the image data
    for (let i = 0; i < imageData1CB.data.length; i += 4) {
      const r = imageData1CB.data[i];
      const g = imageData1CB.data[i + 1];
      const b = imageData1CB.data[i + 2];
      // Simulate deuteranopia (simplified)
      imageData1CB.data[i] = r * 0.625 + g * 0.375;
      imageData1CB.data[i + 1] = r * 0.7 + g * 0.3;
      imageData1CB.data[i + 2] = b;
    }
    ctx1CB.putImageData(imageData1CB, 0, 0);
    
    // Create gradient test
    const testCanvas2 = document.getElementById('test-image-2') as HTMLCanvasElement;
    const ctx2 = testCanvas2.getContext('2d')!;
    const gradient = ctx2.createLinearGradient(0, 0, testCanvas2.width, 0);
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const idx = Math.floor(t * (this.currentColormap.colors.length - 1));
      const color = this.currentColormap.colors[idx];
      gradient.addColorStop(t, `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`);
    }
    ctx2.fillStyle = gradient;
    ctx2.fillRect(0, 0, testCanvas2.width, testCanvas2.height);
    
    // Gradient with color blindness
    const testCanvas2CB = document.getElementById('test-image-2-cb') as HTMLCanvasElement;
    const ctx2CB = testCanvas2CB.getContext('2d')!;
    const imageData2 = ctx2.getImageData(0, 0, testCanvas2.width, testCanvas2.height);
    for (let i = 0; i < imageData2.data.length; i += 4) {
      const r = imageData2.data[i];
      const g = imageData2.data[i + 1];
      const b = imageData2.data[i + 2];
      imageData2.data[i] = r * 0.625 + g * 0.375;
      imageData2.data[i + 1] = r * 0.7 + g * 0.3;
      imageData2.data[i + 2] = b;
    }
    ctx2CB.putImageData(imageData2, 0, 0);
    
    // Create sine wave pattern
    const testCanvas3 = document.getElementById('test-image-3') as HTMLCanvasElement;
    const ctx3 = testCanvas3.getContext('2d')!;
    const imageData3 = ctx3.createImageData(testCanvas3.width, testCanvas3.height);
    for (let y = 0; y < testCanvas3.height; y++) {
      for (let x = 0; x < testCanvas3.width; x++) {
        const value = (Math.sin(x * 0.05) * Math.cos(y * 0.05) + 1) / 2;
        const idx = Math.floor(value * (this.currentColormap.colors.length - 1));
        const color = this.currentColormap.colors[idx];
        const pixelIdx = (y * testCanvas3.width + x) * 4;
        imageData3.data[pixelIdx] = color.r * 255;
        imageData3.data[pixelIdx + 1] = color.g * 255;
        imageData3.data[pixelIdx + 2] = color.b * 255;
        imageData3.data[pixelIdx + 3] = 255;
      }
    }
    ctx3.putImageData(imageData3, 0, 0);
    
    // Sine wave with color blindness
    const testCanvas3CB = document.getElementById('test-image-3-cb') as HTMLCanvasElement;
    const ctx3CB = testCanvas3CB.getContext('2d')!;
    const imageData3CB = new ImageData(
      new Uint8ClampedArray(imageData3.data),
      imageData3.width,
      imageData3.height
    );
    for (let i = 0; i < imageData3CB.data.length; i += 4) {
      const r = imageData3CB.data[i];
      const g = imageData3CB.data[i + 1];
      const b = imageData3CB.data[i + 2];
      imageData3CB.data[i] = r * 0.625 + g * 0.375;
      imageData3CB.data[i + 1] = r * 0.7 + g * 0.3;
      imageData3CB.data[i + 2] = b;
    }
    ctx3CB.putImageData(imageData3CB, 0, 0);
  }
}

// Initialize the application
try {
  console.log('Starting ColormapVisualizer...');
  new ColormapVisualizer();
  console.log('ColormapVisualizer started successfully');
} catch (error) {
  console.error('Failed to initialize ColormapVisualizer:', error);
  const app = document.querySelector<HTMLDivElement>('#app');
  if (app) {
    app.innerHTML = `<div style="color: red; padding: 20px;">
      <h2>Error Loading Application</h2>
      <pre>${error}</pre>
      <p>Check browser console for details.</p>
    </div>`;
  }
}