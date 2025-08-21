import { ColorMap, RGB } from './types';
import chroma from 'chroma-js';

function generateColormap(name: string, chromaScale: any, steps: number = 64): ColorMap {
  const colors: RGB[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const color = chromaScale(t);
    const [r, g, b] = color.rgb();
    colors.push({ r: r / 255, g: g / 255, b: b / 255 });
  }
  return { name, colors };
}

// Use official matplotlib Viridis colormap values (first 64 of 256)
const officialViridisColors: RGB[] = [
  {r: 0.267004, g: 0.004874, b: 0.329415},
  {r: 0.268510, g: 0.009605, b: 0.335427},
  {r: 0.269944, g: 0.014625, b: 0.341379},
  {r: 0.271305, g: 0.019942, b: 0.347269},
  {r: 0.272594, g: 0.025563, b: 0.353093},
  {r: 0.273809, g: 0.031497, b: 0.358853},
  {r: 0.274952, g: 0.037752, b: 0.364543},
  {r: 0.276022, g: 0.044167, b: 0.370164},
  {r: 0.277018, g: 0.050344, b: 0.375715},
  {r: 0.277941, g: 0.056324, b: 0.381191},
  {r: 0.278791, g: 0.062145, b: 0.386592},
  {r: 0.279566, g: 0.067836, b: 0.391917},
  {r: 0.280267, g: 0.073417, b: 0.397163},
  {r: 0.280894, g: 0.078907, b: 0.402329},
  {r: 0.281446, g: 0.084320, b: 0.407414},
  {r: 0.281924, g: 0.089666, b: 0.412415},
  {r: 0.282327, g: 0.094955, b: 0.417331},
  {r: 0.282656, g: 0.100196, b: 0.422160},
  {r: 0.282910, g: 0.105393, b: 0.426902},
  {r: 0.283091, g: 0.110553, b: 0.431554},
  {r: 0.283197, g: 0.115680, b: 0.436115},
  {r: 0.283229, g: 0.120777, b: 0.440584},
  {r: 0.283187, g: 0.125848, b: 0.444960},
  {r: 0.283072, g: 0.130895, b: 0.449241},
  {r: 0.282884, g: 0.135920, b: 0.453427},
  {r: 0.282623, g: 0.140926, b: 0.457517},
  {r: 0.282290, g: 0.145912, b: 0.461510},
  {r: 0.281887, g: 0.150881, b: 0.465405},
  {r: 0.281412, g: 0.155834, b: 0.469201},
  {r: 0.280868, g: 0.160771, b: 0.472899},
  {r: 0.280255, g: 0.165693, b: 0.476498},
  {r: 0.279574, g: 0.170599, b: 0.479997},
  {r: 0.278826, g: 0.175490, b: 0.483397},
  {r: 0.278012, g: 0.180367, b: 0.486697},
  {r: 0.277134, g: 0.185228, b: 0.489898},
  {r: 0.276194, g: 0.190074, b: 0.493001},
  {r: 0.275191, g: 0.194905, b: 0.496005},
  {r: 0.274128, g: 0.199721, b: 0.498911},
  {r: 0.273006, g: 0.204520, b: 0.501721},
  {r: 0.271828, g: 0.209303, b: 0.504434},
  {r: 0.270595, g: 0.214069, b: 0.507052},
  {r: 0.269308, g: 0.218818, b: 0.509577},
  {r: 0.267968, g: 0.223549, b: 0.512008},
  {r: 0.266580, g: 0.228262, b: 0.514349},
  {r: 0.265145, g: 0.232956, b: 0.516599},
  {r: 0.263663, g: 0.237631, b: 0.518762},
  {r: 0.262138, g: 0.242286, b: 0.520837},
  {r: 0.260571, g: 0.246922, b: 0.522828},
  {r: 0.258965, g: 0.251537, b: 0.524736},
  {r: 0.257322, g: 0.256130, b: 0.526563},
  {r: 0.255645, g: 0.260703, b: 0.528312},
  {r: 0.253935, g: 0.265254, b: 0.529983},
  {r: 0.252194, g: 0.269783, b: 0.531579},
  {r: 0.250425, g: 0.274290, b: 0.533103},
  {r: 0.248629, g: 0.278775, b: 0.534556},
  {r: 0.246811, g: 0.283237, b: 0.535941},
  {r: 0.244972, g: 0.287675, b: 0.537260},
  {r: 0.243113, g: 0.292092, b: 0.538516},
  {r: 0.241237, g: 0.296485, b: 0.539709},
  {r: 0.239346, g: 0.300855, b: 0.540844},
  {r: 0.237441, g: 0.305202, b: 0.541921},
  {r: 0.235526, g: 0.309527, b: 0.542944},
  {r: 0.233603, g: 0.313828, b: 0.543914},
  {r: 0.231674, g: 0.318106, b: 0.544834},
  {r: 0.229739, g: 0.322361, b: 0.545706}
];

export const colormaps: ColorMap[] = [
  { name: 'Viridis', colors: officialViridisColors },
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