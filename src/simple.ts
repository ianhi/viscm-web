import './style.css';

console.log('Simple test loading...');

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  console.error('App element not found');
} else {
  console.log('App element found');
  
  try {
    // Test basic imports
    import('chroma-js').then(module => {
      console.log('chroma-js loaded successfully');
      const chroma = module.default;
      const color = chroma('#ff0000');
      console.log('Test color:', color.hex());
    }).catch(err => {
      console.error('Failed to load chroma-js:', err);
    });
    
    app.innerHTML = `
      <div class="header">
        <h1>Colormap Visualization - Test Mode</h1>
        <p>Check browser console for import status</p>
      </div>
      
      <div id="test-content">
        <canvas id="test-canvas" width="400" height="100" style="border: 1px solid #ccc;"></canvas>
      </div>
    `;
    
    // Test canvas drawing
    const canvas = document.getElementById('test-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple gradient
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(1, 'red');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 100);
        console.log('Canvas test successful');
      }
    }
  } catch (error) {
    console.error('Error in simple test:', error);
    app.innerHTML = `<h2>Error: ${error}</h2>`;
  }
}

export {};