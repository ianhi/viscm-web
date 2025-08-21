import * as pako from 'pako';

// Official viscm St. Helens test image data
let viscmTestImageData: { width: number; height: number; data: number[][] } | null = null;

export async function loadViscmTestImage(): Promise<{ width: number; height: number; data: number[][] }> {
  if (viscmTestImageData) {
    return viscmTestImageData;
  }
  
  try {
    // Load the compressed St. Helens elevation data
    const response = await fetch('./src/st-helens_before-modified.txt.gz');
    const compressedData = await response.arrayBuffer();
    
    // Decompress the gzipped data
    const decompressed = pako.inflate(new Uint8Array(compressedData), { to: 'string' });
    
    // Parse the text data (space-separated elevation values)
    const lines = decompressed.trim().split('\n');
    const height = lines.length;
    const width = lines[0].split(/\s+/).length;
    
    console.log(`Loading St. Helens elevation data: ${width}x${height}`);
    
    // Parse elevation data and normalize
    const elevationData: number[][] = [];
    const validValues: number[] = [];
    
    // First pass: collect all valid values for normalization
    for (const line of lines) {
      const values = line.split(/\s+/).map(val => {
        const num = parseFloat(val);
        return isNaN(num) ? NaN : num;
      });
      
      values.forEach(val => {
        if (!isNaN(val)) {
          validValues.push(val);
        }
      });
      
      elevationData.push(values);
    }
    
    // Calculate normalization range
    const minElev = Math.min(...validValues);
    const maxElev = Math.max(...validValues);
    const range = maxElev - minElev;
    
    console.log(`Elevation range: ${minElev} to ${maxElev} meters`);
    
    // Second pass: normalize to 0-1 range
    const normalizedData = elevationData.map(row => 
      row.map(val => {
        if (isNaN(val)) {
          return 0.0; // NaN values become black (0)
        }
        return (val - minElev) / range; // Normalize to 0-1
      })
    );
    
    viscmTestImageData = {
      width,
      height,
      data: normalizedData
    };
    
    return viscmTestImageData;
  } catch (error) {
    console.error('Failed to load viscm St. Helens test image:', error);
    throw error;
  }
}

export function createImageDataFromViscm(viscmData: { width: number; height: number; data: number[][] }): ImageData {
  const { width, height, data } = viscmData;
  const imageData = new ImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const intensity = Math.round(data[y][x] * 255);
      
      imageData.data[pixelIndex] = intensity;     // R
      imageData.data[pixelIndex + 1] = intensity; // G
      imageData.data[pixelIndex + 2] = intensity; // B
      imageData.data[pixelIndex + 3] = 255;       // A
    }
  }
  
  return imageData;
}