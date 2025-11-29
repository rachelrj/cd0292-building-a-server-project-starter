import { ImageFormatSharp } from "../types/imageTypes";
import { resizeAndConvert } from "../services/imageResizer";
import { imageCache } from "../cache/imageCache";

interface GetOrSetOptions {
  originalPath: string;
  width: number;
  height: number;
  format: ImageFormatSharp;
}

export async function getOrSetCachedResizedImage(
  options: GetOrSetOptions
): Promise<Buffer> {
  const { originalPath, width, height, format } = options;

  const cacheKey = `${originalPath}:${width}x${height}:${format}`;

  const cached = imageCache.get(cacheKey);
  if (cached) {
    console.log("📦 Cache HIT:", cacheKey);
    return cached;
  }

  console.log("🛠 Cache MISS:", cacheKey);

  const sharpInstance = await resizeAndConvert(
    originalPath,
    width,
    height,
    format
  );

  const buffer = await sharpInstance.toBuffer();

  imageCache.set(cacheKey, buffer);

  return buffer;
}
