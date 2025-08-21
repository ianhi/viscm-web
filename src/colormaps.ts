import { ColorMap, RGB } from './types';

// Cache for loaded colormaps
let colormapsCache: ColorMap[] | null = null;
let colormapIndex: any = null;

// Load colormaps from JSON files
async function loadColormaps(): Promise<ColorMap[]> {
  if (colormapsCache) {
    return colormapsCache;
  }

  try {
    // Load the index file which contains all colormap data
    const response = await fetch('/colormaps/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load colormaps: ${response.statusText}`);
    }
    
    colormapIndex = await response.json();
    colormapsCache = colormapIndex.colormaps;
    
    return colormapsCache;
  } catch (error) {
    console.error('Failed to load colormaps:', error);
    // Fallback to basic viridis if loading fails
    return [{
      name: 'viridis',
      colors: [
        { r: 0.267004, g: 0.004874, b: 0.329415 },
        { r: 0.268510, g: 0.009605, b: 0.335427 },
        { r: 0.993248, g: 0.906157, b: 0.143936 }
      ],
      metadata: { source: 'fallback', category: 'perceptually_uniform' }
    }];
  }
}

// Export synchronous access (will be populated after loading)
export let colormaps: ColorMap[] = [];

// Initialize colormaps on module load
loadColormaps().then(cmaps => {
  colormaps.splice(0, colormaps.length, ...cmaps);
  console.log(`Loaded ${cmaps.length} colormaps`);
}).catch(error => {
  console.error('Failed to initialize colormaps:', error);
});

export async function getColormaps(): Promise<ColorMap[]> {
  return await loadColormaps();
}

export function getColormap(name: string): ColorMap | undefined {
  return colormaps.find(cm => cm.name === name);
}

export function getColormapsByCategory(category: string): ColorMap[] {
  return colormaps.filter(cm => cm.metadata?.category === category);
}

export function getAvailableCategories(): string[] {
  if (!colormapIndex?.categories) return [];
  return Object.keys(colormapIndex.categories);
}

export function getAllColormapNames(): string[] {
  return colormaps.map(cm => cm.name);
}