export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorMap {
  name: string;
  colors: RGB[];
}

export interface PerceptualStats {
  totalLength: number;
  rmsDeviation: number;
  maxDelta: number;
  minDelta: number;
}