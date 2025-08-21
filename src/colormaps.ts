import { ColorMap, RGB } from './types';
import chroma from 'chroma-js';

function generateColormap(name: string, chromaScale: any, steps: number = 256): ColorMap {
  const colors: RGB[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const color = chromaScale(t);
    const [r, g, b] = color.rgb();
    colors.push({ r: r / 255, g: g / 255, b: b / 255 });
  }
  return { name, colors };
}

export const colormaps: ColorMap[] = [
  generateColormap('Viridis', chroma.scale(['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'])),
  generateColormap('Jet', chroma.scale(['#000080', '#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000', '#800000'])),
  generateColormap('Turbo', chroma.scale(['#30123b', '#4662d7', '#36aafe', '#1ae4b6', '#72fe5e', '#c7ef34', '#faba39', '#f66b19', '#ca2a04', '#7a0403'])),
  generateColormap('Rainbow', chroma.scale(['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'])),
  generateColormap('Cool', chroma.scale(['#00ffff', '#ff00ff'])),
  generateColormap('Hot', chroma.scale(['black', 'red', 'yellow', 'white'])),
  generateColormap('Gray', chroma.scale(['black', 'white'])),
  generateColormap('RdBu', chroma.scale(['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac']).domain([0, 1])),
  generateColormap('Spectral', chroma.scale(['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'])),
  generateColormap('Plasma', chroma.scale(['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'])),
  generateColormap('Inferno', chroma.scale(['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d03c', '#fcffa4'])),
  generateColormap('Magma', chroma.scale(['#000004', '#180f3d', '#440f76', '#721f81', '#9e2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d', '#fcfdbf'])),
  generateColormap('Cividis', chroma.scale(['#00224e', '#123570', '#3b496c', '#575d6d', '#707173', '#8a8678', '#a59c74', '#c3b369', '#e1cc55', '#fee838']))
];

export function getColormap(name: string): ColorMap | undefined {
  return colormaps.find(cm => cm.name.toLowerCase() === name.toLowerCase());
}