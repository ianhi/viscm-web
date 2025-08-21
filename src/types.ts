export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorMap {
  name: string;
  colors: RGB[];
  metadata?: {
    source?: string;
    num_points?: number;
    type?: string;
    category?: string;
  };
}

export interface PerceptualStats {
  totalLength: number;
  rmsDeviation: number;
  maxDelta: number;
  minDelta: number;
}