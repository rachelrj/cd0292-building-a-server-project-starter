import sharp from "sharp";

export async function getExistingImageDimensions(
  filePath: string,
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(filePath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read image dimensions");
  }

  return {
    width: metadata.width,
    height: metadata.height,
  };
}
