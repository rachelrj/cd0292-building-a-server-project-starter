export type ImageFormat = "jpeg" | "png" | "webp" | "avif";

export interface ResizedImage {
  original: string;
  width?: number;
  height?: number;
  format?: ImageFormat;

  outputPath: string;
  cacheKey: string;
}
