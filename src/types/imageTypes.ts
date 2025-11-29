export const IMAGE_FORMATS_NATURAL = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "avif",
] as const;
export const IMAGE_FORMATS_SHARP = ["jpeg", "png", "webp", "avif"] as const;

export type ImageFormatNatural = (typeof IMAGE_FORMATS_NATURAL)[number];
export type ImageFormatSharp = (typeof IMAGE_FORMATS_SHARP)[number];

export interface ResizedImage {
  original: string;
  width?: number;
  height?: number;
  format?: ImageFormatSharp;

  outputPath: string;
  cacheKey: string;
}
