import './style.css';
import { getColormap, getColormapNames, getAllColormapNames } from './colormaps';
import { ColorMap } from './types';
import {
  calculatePerceptualDeltas,
  calculateLightnessDeltas,
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
import { simulate } from '@bjornlu/colorblind';
import { loadViscmTestImage, createImageDataFromViscm } from './test-image-data';

class ColormapVisualizer {
  private cachedViscmData: ImageData | null = null;
  private currentColormap: ColorMap = {
    name: 'viridis',
    colors: [
      { r: 0.267004, g: 0.004874, b: 0.329415 },
      { r: 0.268510, g: 0.009605, b: 0.335427 },
      { r: 0.269944, g: 0.014625, b: 0.341379 },
      { r: 0.271305, g: 0.019942, b: 0.347269 },
      { r: 0.272594, g: 0.025563, b: 0.353093 },
      { r: 0.273809, g: 0.031497, b: 0.358853 },
      { r: 0.274952, g: 0.037752, b: 0.364543 },
      { r: 0.276022, g: 0.044167, b: 0.370164 },
      { r: 0.277018, g: 0.050344, b: 0.375715 },
      { r: 0.277941, g: 0.056324, b: 0.381191 },
      { r: 0.278791, g: 0.062145, b: 0.386592 },
      { r: 0.279566, g: 0.067836, b: 0.391917 },
      { r: 0.280267, g: 0.073417, b: 0.397163 },
      { r: 0.280894, g: 0.078907, b: 0.402329 },
      { r: 0.281446, g: 0.084320, b: 0.407414 },
      { r: 0.281924, g: 0.089666, b: 0.412415 },
      { r: 0.282327, g: 0.094955, b: 0.417331 },
      { r: 0.282656, g: 0.100196, b: 0.422160 },
      { r: 0.282910, g: 0.105393, b: 0.426902 },
      { r: 0.283091, g: 0.110553, b: 0.431554 },
      { r: 0.283197, g: 0.115680, b: 0.436115 },
      { r: 0.283229, g: 0.120777, b: 0.440584 },
      { r: 0.283187, g: 0.125848, b: 0.444960 },
      { r: 0.283072, g: 0.130895, b: 0.449241 },
      { r: 0.282884, g: 0.135920, b: 0.453427 },
      { r: 0.282623, g: 0.140926, b: 0.457517 },
      { r: 0.282290, g: 0.145912, b: 0.461510 },
      { r: 0.281887, g: 0.150881, b: 0.465405 },
      { r: 0.281412, g: 0.155834, b: 0.469201 },
      { r: 0.280868, g: 0.160771, b: 0.472899 },
      { r: 0.280255, g: 0.165693, b: 0.476498 },
      { r: 0.279574, g: 0.170599, b: 0.479997 },
      { r: 0.278826, g: 0.175490, b: 0.483397 },
      { r: 0.278012, g: 0.180367, b: 0.486697 },
      { r: 0.277134, g: 0.185228, b: 0.489898 },
      { r: 0.276194, g: 0.190074, b: 0.493001 },
      { r: 0.275191, g: 0.194905, b: 0.496005 },
      { r: 0.274128, g: 0.199721, b: 0.498911 },
      { r: 0.273006, g: 0.204520, b: 0.501721 },
      { r: 0.271828, g: 0.209303, b: 0.504434 },
      { r: 0.270595, g: 0.214069, b: 0.507052 },
      { r: 0.269308, g: 0.218818, b: 0.509577 },
      { r: 0.267968, g: 0.223549, b: 0.512008 },
      { r: 0.266580, g: 0.228262, b: 0.514349 },
      { r: 0.265145, g: 0.232956, b: 0.516599 },
      { r: 0.263663, g: 0.237631, b: 0.518762 },
      { r: 0.262138, g: 0.242286, b: 0.520837 },
      { r: 0.260571, g: 0.246922, b: 0.522828 },
      { r: 0.258965, g: 0.251537, b: 0.524736 },
      { r: 0.257322, g: 0.256130, b: 0.526563 },
      { r: 0.255645, g: 0.260703, b: 0.528312 },
      { r: 0.253935, g: 0.265254, b: 0.529983 },
      { r: 0.252194, g: 0.269783, b: 0.531579 },
      { r: 0.250425, g: 0.274290, b: 0.533103 },
      { r: 0.248629, g: 0.278775, b: 0.534556 },
      { r: 0.246811, g: 0.283237, b: 0.535941 },
      { r: 0.244972, g: 0.287675, b: 0.537260 },
      { r: 0.243113, g: 0.292092, b: 0.538516 },
      { r: 0.241237, g: 0.296485, b: 0.539709 },
      { r: 0.239346, g: 0.300855, b: 0.540844 },
      { r: 0.237441, g: 0.305202, b: 0.541921 },
      { r: 0.235526, g: 0.309527, b: 0.542944 },
      { r: 0.233603, g: 0.313828, b: 0.543914 },
      { r: 0.231674, g: 0.318106, b: 0.544834 },
      { r: 0.229739, g: 0.322361, b: 0.545706 },
      { r: 0.227802, g: 0.326594, b: 0.546532 },
      { r: 0.225863, g: 0.330805, b: 0.547314 },
      { r: 0.223925, g: 0.334994, b: 0.548053 },
      { r: 0.221989, g: 0.339161, b: 0.548752 },
      { r: 0.220057, g: 0.343307, b: 0.549413 },
      { r: 0.218130, g: 0.347432, b: 0.550038 },
      { r: 0.216210, g: 0.351535, b: 0.550627 },
      { r: 0.214298, g: 0.355619, b: 0.551184 },
      { r: 0.212395, g: 0.359683, b: 0.551710 },
      { r: 0.210503, g: 0.363727, b: 0.552206 },
      { r: 0.208623, g: 0.367752, b: 0.552675 },
      { r: 0.206756, g: 0.371758, b: 0.553117 },
      { r: 0.204903, g: 0.375746, b: 0.553533 },
      { r: 0.203063, g: 0.379716, b: 0.553925 },
      { r: 0.201239, g: 0.383670, b: 0.554294 },
      { r: 0.199430, g: 0.387607, b: 0.554642 },
      { r: 0.197636, g: 0.391528, b: 0.554969 },
      { r: 0.195860, g: 0.395433, b: 0.555276 },
      { r: 0.194100, g: 0.399323, b: 0.555565 },
      { r: 0.192357, g: 0.403199, b: 0.555836 },
      { r: 0.190631, g: 0.407061, b: 0.556089 },
      { r: 0.188923, g: 0.410910, b: 0.556326 },
      { r: 0.187231, g: 0.414746, b: 0.556547 },
      { r: 0.185556, g: 0.418570, b: 0.556753 },
      { r: 0.183898, g: 0.422383, b: 0.556944 },
      { r: 0.182256, g: 0.426184, b: 0.557120 },
      { r: 0.180629, g: 0.429975, b: 0.557282 },
      { r: 0.179019, g: 0.433756, b: 0.557430 },
      { r: 0.177423, g: 0.437527, b: 0.557565 },
      { r: 0.175841, g: 0.441290, b: 0.557685 },
      { r: 0.174274, g: 0.445044, b: 0.557792 },
      { r: 0.172719, g: 0.448791, b: 0.557885 },
      { r: 0.171176, g: 0.452530, b: 0.557965 },
      { r: 0.169646, g: 0.456262, b: 0.558030 },
      { r: 0.168126, g: 0.459988, b: 0.558082 },
      { r: 0.166617, g: 0.463708, b: 0.558119 },
      { r: 0.165117, g: 0.467423, b: 0.558141 },
      { r: 0.163625, g: 0.471133, b: 0.558148 },
      { r: 0.162142, g: 0.474838, b: 0.558140 },
      { r: 0.160665, g: 0.478540, b: 0.558115 },
      { r: 0.159194, g: 0.482237, b: 0.558073 },
      { r: 0.157729, g: 0.485932, b: 0.558013 },
      { r: 0.156270, g: 0.489624, b: 0.557936 },
      { r: 0.154815, g: 0.493313, b: 0.557840 },
      { r: 0.153364, g: 0.497000, b: 0.557724 },
      { r: 0.151918, g: 0.500685, b: 0.557587 },
      { r: 0.150476, g: 0.504369, b: 0.557430 },
      { r: 0.149039, g: 0.508051, b: 0.557250 },
      { r: 0.147607, g: 0.511733, b: 0.557049 },
      { r: 0.146180, g: 0.515413, b: 0.556823 },
      { r: 0.144759, g: 0.519093, b: 0.556572 },
      { r: 0.143343, g: 0.522773, b: 0.556295 },
      { r: 0.141935, g: 0.526453, b: 0.555991 },
      { r: 0.140536, g: 0.530132, b: 0.555659 },
      { r: 0.139147, g: 0.533812, b: 0.555298 },
      { r: 0.137770, g: 0.537492, b: 0.554906 },
      { r: 0.136408, g: 0.541173, b: 0.554483 },
      { r: 0.135066, g: 0.544853, b: 0.554029 },
      { r: 0.133743, g: 0.548535, b: 0.553541 },
      { r: 0.132444, g: 0.552216, b: 0.553018 },
      { r: 0.131172, g: 0.555899, b: 0.552459 },
      { r: 0.129933, g: 0.559582, b: 0.551864 },
      { r: 0.128729, g: 0.563265, b: 0.551229 },
      { r: 0.127568, g: 0.566949, b: 0.550556 },
      { r: 0.126453, g: 0.570633, b: 0.549841 },
      { r: 0.125394, g: 0.574318, b: 0.549086 },
      { r: 0.124395, g: 0.578002, b: 0.548287 },
      { r: 0.123463, g: 0.581687, b: 0.547445 },
      { r: 0.122606, g: 0.585371, b: 0.546557 },
      { r: 0.121831, g: 0.589055, b: 0.545623 },
      { r: 0.121148, g: 0.592739, b: 0.544641 },
      { r: 0.120565, g: 0.596422, b: 0.543611 },
      { r: 0.120092, g: 0.600104, b: 0.542530 },
      { r: 0.119738, g: 0.603785, b: 0.541400 },
      { r: 0.119512, g: 0.607464, b: 0.540218 },
      { r: 0.119423, g: 0.611141, b: 0.538982 },
      { r: 0.119483, g: 0.614817, b: 0.537692 },
      { r: 0.119699, g: 0.618490, b: 0.536347 },
      { r: 0.120081, g: 0.622161, b: 0.534946 },
      { r: 0.120638, g: 0.625828, b: 0.533488 },
      { r: 0.121380, g: 0.629492, b: 0.531973 },
      { r: 0.122312, g: 0.633153, b: 0.530398 },
      { r: 0.123444, g: 0.636809, b: 0.528763 },
      { r: 0.124780, g: 0.640461, b: 0.527068 },
      { r: 0.126326, g: 0.644107, b: 0.525311 },
      { r: 0.128087, g: 0.647749, b: 0.523491 },
      { r: 0.130067, g: 0.651384, b: 0.521608 },
      { r: 0.132268, g: 0.655014, b: 0.519661 },
      { r: 0.134692, g: 0.658636, b: 0.517649 },
      { r: 0.137339, g: 0.662252, b: 0.515571 },
      { r: 0.140210, g: 0.665859, b: 0.513427 },
      { r: 0.143303, g: 0.669459, b: 0.511215 },
      { r: 0.146616, g: 0.673050, b: 0.508936 },
      { r: 0.150148, g: 0.676631, b: 0.506589 },
      { r: 0.153894, g: 0.680203, b: 0.504172 },
      { r: 0.157851, g: 0.683765, b: 0.501686 },
      { r: 0.162016, g: 0.687316, b: 0.499129 },
      { r: 0.166383, g: 0.690856, b: 0.496502 },
      { r: 0.170948, g: 0.694384, b: 0.493803 },
      { r: 0.175707, g: 0.697900, b: 0.491033 },
      { r: 0.180653, g: 0.701402, b: 0.488189 },
      { r: 0.185783, g: 0.704891, b: 0.485273 },
      { r: 0.191090, g: 0.708366, b: 0.482284 },
      { r: 0.196571, g: 0.711827, b: 0.479221 },
      { r: 0.202219, g: 0.715272, b: 0.476084 },
      { r: 0.208030, g: 0.718701, b: 0.472873 },
      { r: 0.214000, g: 0.722114, b: 0.469588 },
      { r: 0.220124, g: 0.725509, b: 0.466226 },
      { r: 0.226397, g: 0.728888, b: 0.462789 },
      { r: 0.232815, g: 0.732247, b: 0.459277 },
      { r: 0.239374, g: 0.735588, b: 0.455688 },
      { r: 0.246070, g: 0.738910, b: 0.452024 },
      { r: 0.252899, g: 0.742211, b: 0.448284 },
      { r: 0.259857, g: 0.745492, b: 0.444467 },
      { r: 0.266941, g: 0.748751, b: 0.440573 },
      { r: 0.274149, g: 0.751988, b: 0.436601 },
      { r: 0.281477, g: 0.755203, b: 0.432552 },
      { r: 0.288921, g: 0.758394, b: 0.428426 },
      { r: 0.296479, g: 0.761561, b: 0.424223 },
      { r: 0.304148, g: 0.764704, b: 0.419943 },
      { r: 0.311925, g: 0.767822, b: 0.415586 },
      { r: 0.319809, g: 0.770914, b: 0.411152 },
      { r: 0.327796, g: 0.773980, b: 0.406640 },
      { r: 0.335885, g: 0.777018, b: 0.402049 },
      { r: 0.344074, g: 0.780029, b: 0.397381 },
      { r: 0.352360, g: 0.783011, b: 0.392636 },
      { r: 0.360741, g: 0.785964, b: 0.387814 },
      { r: 0.369214, g: 0.788888, b: 0.382914 },
      { r: 0.377779, g: 0.791781, b: 0.377939 },
      { r: 0.386433, g: 0.794644, b: 0.372886 },
      { r: 0.395174, g: 0.797475, b: 0.367757 },
      { r: 0.404001, g: 0.800275, b: 0.362552 },
      { r: 0.412913, g: 0.803041, b: 0.357269 },
      { r: 0.421908, g: 0.805774, b: 0.351910 },
      { r: 0.430983, g: 0.808473, b: 0.346476 },
      { r: 0.440137, g: 0.811138, b: 0.340967 },
      { r: 0.449368, g: 0.813768, b: 0.335384 },
      { r: 0.458674, g: 0.816363, b: 0.329727 },
      { r: 0.468053, g: 0.818921, b: 0.323998 },
      { r: 0.477504, g: 0.821444, b: 0.318195 },
      { r: 0.487026, g: 0.823929, b: 0.312321 },
      { r: 0.496615, g: 0.826376, b: 0.306377 },
      { r: 0.506271, g: 0.828786, b: 0.300362 },
      { r: 0.515992, g: 0.831158, b: 0.294279 },
      { r: 0.525776, g: 0.833491, b: 0.288127 },
      { r: 0.535621, g: 0.835785, b: 0.281908 },
      { r: 0.545524, g: 0.838039, b: 0.275626 },
      { r: 0.555484, g: 0.840254, b: 0.269281 },
      { r: 0.565498, g: 0.842430, b: 0.262877 },
      { r: 0.575563, g: 0.844566, b: 0.256415 },
      { r: 0.585678, g: 0.846661, b: 0.249897 },
      { r: 0.595839, g: 0.848717, b: 0.243329 },
      { r: 0.606045, g: 0.850733, b: 0.236712 },
      { r: 0.616293, g: 0.852709, b: 0.230052 },
      { r: 0.626579, g: 0.854645, b: 0.223353 },
      { r: 0.636902, g: 0.856542, b: 0.216620 },
      { r: 0.647257, g: 0.858400, b: 0.209861 },
      { r: 0.657642, g: 0.860219, b: 0.203082 },
      { r: 0.668054, g: 0.861999, b: 0.196293 },
      { r: 0.678489, g: 0.863742, b: 0.189503 },
      { r: 0.688944, g: 0.865448, b: 0.182725 },
      { r: 0.699415, g: 0.867117, b: 0.175971 },
      { r: 0.709898, g: 0.868751, b: 0.169257 },
      { r: 0.720391, g: 0.870350, b: 0.162603 },
      { r: 0.730889, g: 0.871916, b: 0.156029 },
      { r: 0.741388, g: 0.873449, b: 0.149561 },
      { r: 0.751884, g: 0.874951, b: 0.143228 },
      { r: 0.762373, g: 0.876424, b: 0.137064 },
      { r: 0.772852, g: 0.877868, b: 0.131109 },
      { r: 0.783315, g: 0.879285, b: 0.125405 },
      { r: 0.793760, g: 0.880678, b: 0.120005 },
      { r: 0.804182, g: 0.882046, b: 0.114965 },
      { r: 0.814576, g: 0.883393, b: 0.110347 },
      { r: 0.824940, g: 0.884720, b: 0.106217 },
      { r: 0.835270, g: 0.886029, b: 0.102646 },
      { r: 0.845561, g: 0.887322, b: 0.099702 },
      { r: 0.855810, g: 0.888601, b: 0.097452 },
      { r: 0.866013, g: 0.889868, b: 0.095953 },
      { r: 0.876168, g: 0.891125, b: 0.095250 },
      { r: 0.886271, g: 0.892374, b: 0.095374 },
      { r: 0.896320, g: 0.893616, b: 0.096335 },
      { r: 0.906311, g: 0.894855, b: 0.098125 },
      { r: 0.916242, g: 0.896091, b: 0.100717 },
      { r: 0.926106, g: 0.897330, b: 0.104071 },
      { r: 0.935904, g: 0.898570, b: 0.108131 },
      { r: 0.945636, g: 0.899815, b: 0.112838 },
      { r: 0.955300, g: 0.901065, b: 0.118128 },
      { r: 0.964894, g: 0.902323, b: 0.123941 },
      { r: 0.974417, g: 0.903590, b: 0.130215 },
      { r: 0.983868, g: 0.904867, b: 0.136897 },
      { r: 0.993248, g: 0.906157, b: 0.143936 }
    ],
    metadata: { source: 'matplotlib', category: 'perceptually_uniform' }
  };
  private deltaEMethod = '2000';

  constructor() {
    this.initializeUI();
    this.loadAndInitialize();
  }

  private loadAndInitialize() {
    // Populate UI with embedded colormap names (no await needed)
    this.updateColormapOptions();
    
    // Start with viridis (already loaded)
    this.updateVisualization();
    
    // Load index in background to potentially update the list later
    getColormapNames().then(() => {
      // Refresh options if the server list differs from embedded
      this.updateColormapOptions();
    }).catch(() => {
      // Ignore errors, embedded list works fine
    });
  }

  private initializeUI() {
    const app = document.querySelector<HTMLDivElement>('#app')!;

    app.innerHTML = `
      <div class="header">
        <h1>Colormap Visualization</h1>
        <div class="controls">
          <select id="colormap-select">
            <option value="">Loading colormaps...</option>
          </select>
          <select id="deltae-method">
            <option value="2000">ΔE 2000</option>
            <option value="76">ΔE 76</option>
            <option value="CMC">ΔE CMC</option>
            <option value="ITP">ΔE ITP</option>
            <option value="Jz">ΔE Jz</option>
          </select>
        </div>
      </div>
      
      <div class="visualization-grid">
        <div class="viz-panel colormap-strip">
          <h3>Colormap</h3>
          <canvas id="colormap-canvas"></canvas>
        </div>
        
        <div class="viz-panel perceptual-delta">
          <h3>Perceptual Derivative (ΔE)</h3>
          <div id="perceptual-delta-plot" class="plot-container"></div>
        </div>
        
        <div class="viz-panel grayscale-strip">
          <h3>Grayscale</h3>
          <canvas id="grayscale-canvas"></canvas>
        </div>
        
        <div class="viz-panel lightness-delta">
          <h3>Lightness Derivative (ΔL*)</h3>
          <div id="lightness-delta-plot" class="plot-container"></div>
        </div>
        
        <div class="viz-panel deuteranopia">
          <h3>Deuteranopia</h3>
          <canvas id="deuteranopia-canvas"></canvas>
        </div>
        
        <div class="viz-panel protanopia">
          <h3>Protanopia</h3>
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
          <h3>Test Pattern (Grayscale)</h3>
          <canvas id="test-image-1-cb"></canvas>
        </div>
        
        <div class="viz-panel test-image-2">
          <h3>Test Pattern (Deuteranopia)</h3>
          <canvas id="test-image-2"></canvas>
        </div>
        
        <div class="viz-panel test-image-2-cb">
          <h3>Test Pattern (Protanopia)</h3>
          <canvas id="test-image-2-cb"></canvas>
        </div>
        
        <div class="viz-panel test-image-3">
          <h3>Sine Wave Pattern</h3>
          <canvas id="test-image-3"></canvas>
        </div>
        
        <div class="viz-panel test-image-3-cb">
          <h3>Sine Wave (Grayscale)</h3>
          <canvas id="test-image-3-cb"></canvas>
        </div>
      </div>
    `;

    // Add event listeners
    const colormapSelect = document.getElementById('colormap-select') as HTMLSelectElement;
    colormapSelect.addEventListener('change', async (e) => {
      const target = e.target as HTMLSelectElement;
      const colormapName = target.value;

      if (!colormapName) return;

      // Show loading state
      target.disabled = true;
      target.style.opacity = '0.6';

      try {
        const colormap = await getColormap(colormapName);
        if (colormap) {
          this.currentColormap = colormap;
          this.updateVisualization();
        }
      } catch (error) {
        console.error(`Failed to load colormap ${colormapName}:`, error);
        // Revert to previous selection on error
        target.value = this.currentColormap.name;
      } finally {
        // Re-enable select
        target.disabled = false;
        target.style.opacity = '1';
      }
    });

    const deltaESelect = document.getElementById('deltae-method') as HTMLSelectElement;
    deltaESelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.deltaEMethod = target.value;
      this.updatePerceptualAnalysis();
    });

    // Setup canvases
    this.setupCanvases();
  }

  private updateColormapOptions() {
    const select = document.getElementById('colormap-select') as HTMLSelectElement;
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    // Add colormap options using the names list
    const names = getAllColormapNames();
    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    // Set default selection
    if (this.currentColormap) {
      select.value = this.currentColormap.name;
    }
  }

  private setupCanvases() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width - 16;
      
      // Make colormap strips thicker but test images fill completely
      if (canvas.id === 'colormap-canvas' || canvas.id === 'grayscale-canvas' || 
          canvas.id === 'deuteranopia-canvas' || canvas.id === 'protanopia-canvas') {
        canvas.height = Math.max(120, rect.height - 10);
      } else if (canvas.id.startsWith('test-image')) {
        canvas.height = rect.height - 16; // Test images fill container with minimal padding
      } else {
        canvas.height = rect.height - 40; // Other canvases (3D plot, etc.)
      }
    });

    // Handle resize
    let resizeTimeout: number | undefined;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.setupCanvases();
        this.updateVisualization();
        this.drawTestImages();
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
    const perceptualDeltas = calculatePerceptualDeltas(colors, this.deltaEMethod);
    const perceptualPlot = document.getElementById('perceptual-delta-plot')!;
    drawLineChart(perceptualPlot, perceptualDeltas, `ΔE ${this.deltaEMethod}`);


    // Calculate and draw lightness deltas
    const lightnessDeltas = calculateLightnessDeltas(colors);
    const lightnessPlot = document.getElementById('lightness-delta-plot')!;
    drawLineChart(lightnessPlot, lightnessDeltas, 'Lightness Derivative (ΔL*)');


    // Draw color blindness simulations
    const deuteranopiaCanvas = document.getElementById('deuteranopia-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(deuteranopiaCanvas, colors, 'deuteranopia');

    const protanopiaCanvas = document.getElementById('protanopia-canvas') as HTMLCanvasElement;
    drawColorBlindSimulation(protanopiaCanvas, colors, 'protanopia');

    // Draw 3D color space
    const plotContainer = document.getElementById('color-space-plot')!;
    draw3DColorSpace(plotContainer, this.currentColormap);

    // Draw test images
    this.drawTestImages();
  }

  private updatePerceptualAnalysis() {
    const colors = this.currentColormap.colors;

    // Update perceptual deltas (deltaE-dependent)
    const perceptualDeltas = calculatePerceptualDeltas(colors, this.deltaEMethod);
    const perceptualPlot = document.getElementById('perceptual-delta-plot')!;
    drawLineChart(perceptualPlot, perceptualDeltas, `ΔE ${this.deltaEMethod}`);


    // Note: Lightness deltas don't need updating since they don't depend on deltaE method
  }

  private async drawTestImages() {
    try {
      // Load and cache the St. Helens data once
      if (!this.cachedViscmData) {
        const viscmData = await loadViscmTestImage();
        this.cachedViscmData = createImageDataFromViscm(viscmData);
      }

      // Test pattern in colormap (row 1, left)
      const testCanvas1 = document.getElementById('test-image-1') as HTMLCanvasElement;
      if (testCanvas1) {
        const ctx1 = testCanvas1.getContext('2d')!;
        // Scale the cached image to fit canvas
        const scaledImageData = this.scaleImageData(this.cachedViscmData, testCanvas1.width, testCanvas1.height);
        const coloredImage1 = applyColormapToImage(scaledImageData, this.currentColormap);
        ctx1.putImageData(coloredImage1, 0, 0);
      }

      // Test pattern in grayscale (row 1, right)
      const testCanvas1CB = document.getElementById('test-image-1-cb') as HTMLCanvasElement;
      if (testCanvas1CB) {
        const ctx1CB = testCanvas1CB.getContext('2d')!;
        // Scale the cached image to fit canvas and keep as grayscale
        const scaledImageData = this.scaleImageData(this.cachedViscmData, testCanvas1CB.width, testCanvas1CB.height);
        ctx1CB.putImageData(scaledImageData, 0, 0);
      }

      // Test pattern with deuteranopia simulation (row 2, left)
      const testCanvas2 = document.getElementById('test-image-2') as HTMLCanvasElement;
      if (testCanvas2) {
        const ctx2 = testCanvas2.getContext('2d')!;
        const scaledImageData = this.scaleImageData(this.cachedViscmData, testCanvas2.width, testCanvas2.height);
        const coloredImage2 = applyColormapToImage(scaledImageData, this.currentColormap);
        
        // First draw the colored image
        ctx2.putImageData(coloredImage2, 0, 0);
        
        // Then apply proper deuteranopia simulation
        const imageData = ctx2.getImageData(0, 0, testCanvas2.width, testCanvas2.height);
        const simulatedData = new ImageData(testCanvas2.width, testCanvas2.height);
        
        for (let i = 0; i < imageData.data.length; i += 4) {
          const rgb = {
            r: imageData.data[i],
            g: imageData.data[i + 1], 
            b: imageData.data[i + 2]
          };
          
          const simulated = simulate(rgb, 'deuteranopia');
          simulatedData.data[i] = simulated.r;
          simulatedData.data[i + 1] = simulated.g;
          simulatedData.data[i + 2] = simulated.b;
          simulatedData.data[i + 3] = imageData.data[i + 3];
        }
        
        ctx2.putImageData(simulatedData, 0, 0);
      }

      // Test pattern with protanopia simulation (row 2, right)
      const testCanvas2CB = document.getElementById('test-image-2-cb') as HTMLCanvasElement;
      if (testCanvas2CB) {
        const ctx2CB = testCanvas2CB.getContext('2d')!;
        const scaledImageData = this.scaleImageData(this.cachedViscmData, testCanvas2CB.width, testCanvas2CB.height);
        const coloredImage2 = applyColormapToImage(scaledImageData, this.currentColormap);
        
        // First draw the colored image
        ctx2CB.putImageData(coloredImage2, 0, 0);
        
        // Then apply proper protanopia simulation
        const imageData = ctx2CB.getImageData(0, 0, testCanvas2CB.width, testCanvas2CB.height);
        const simulatedData = new ImageData(testCanvas2CB.width, testCanvas2CB.height);
        
        for (let i = 0; i < imageData.data.length; i += 4) {
          const rgb = {
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2]
          };
          
          const simulated = simulate(rgb, 'protanopia');
          simulatedData.data[i] = simulated.r;
          simulatedData.data[i + 1] = simulated.g;
          simulatedData.data[i + 2] = simulated.b;
          simulatedData.data[i + 3] = imageData.data[i + 3];
        }
        
        ctx2CB.putImageData(simulatedData, 0, 0);
      }

      // Sine wave pattern in colormap (bottom row, left)
      const testCanvas3 = document.getElementById('test-image-3') as HTMLCanvasElement;
      if (testCanvas3) {
        const ctx3 = testCanvas3.getContext('2d')!;
        const sineWaveImage = generateTestPattern(testCanvas3.width, testCanvas3.height);
        const coloredSineWave = applyColormapToImage(sineWaveImage, this.currentColormap);
        ctx3.putImageData(coloredSineWave, 0, 0);
      }

      // Sine wave pattern in grayscale (bottom row, right)
      const testCanvas3CB = document.getElementById('test-image-3-cb') as HTMLCanvasElement;
      if (testCanvas3CB) {
        const ctx3CB = testCanvas3CB.getContext('2d')!;
        const sineWaveImage = generateTestPattern(testCanvas3CB.width, testCanvas3CB.height);
        // Keep as grayscale (don't apply colormap)
        ctx3CB.putImageData(sineWaveImage, 0, 0);
      }
      
    } catch (error) {
      console.error('Failed to load viscm test image, falling back to generated patterns:', error);
      // Fallback to generated patterns for all tests
      this.drawGeneratedTestImages();
    }
  }

  private scaleImageData(sourceData: ImageData, targetWidth: number, targetHeight: number): ImageData {
    const scaledData = new ImageData(targetWidth, targetHeight);
    const scaleX = sourceData.width / targetWidth;
    const scaleY = sourceData.height / targetHeight;

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const sourceX = Math.floor(x * scaleX);
        const sourceY = Math.floor(y * scaleY);
        const sourceIndex = (sourceY * sourceData.width + sourceX) * 4;
        const targetIndex = (y * targetWidth + x) * 4;

        scaledData.data[targetIndex] = sourceData.data[sourceIndex];
        scaledData.data[targetIndex + 1] = sourceData.data[sourceIndex + 1];
        scaledData.data[targetIndex + 2] = sourceData.data[sourceIndex + 2];
        scaledData.data[targetIndex + 3] = sourceData.data[sourceIndex + 3];
      }
    }

    return scaledData;
  }

  private drawGeneratedTestImages() {
    // Fallback to generated test patterns
    const testCanvas1 = document.getElementById('test-image-1') as HTMLCanvasElement;
    if (testCanvas1) {
      const ctx1 = testCanvas1.getContext('2d')!;
      const testImage1 = generateTestPattern(testCanvas1.width, testCanvas1.height);
      const coloredImage1 = applyColormapToImage(testImage1, this.currentColormap);
      ctx1.putImageData(coloredImage1, 0, 0);
    }

    const testCanvas1CB = document.getElementById('test-image-1-cb') as HTMLCanvasElement;
    if (testCanvas1CB) {
      const ctx1CB = testCanvas1CB.getContext('2d')!;
      const testImage1 = generateTestPattern(testCanvas1CB.width, testCanvas1CB.height);
      ctx1CB.putImageData(testImage1, 0, 0);
    }
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
