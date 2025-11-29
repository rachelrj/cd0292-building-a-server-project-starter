import sharp, { Sharp } from "sharp";

export async function resizeAndConvert(
  inputPath: string,
  width: number,
  height: number,
  format?: "jpeg" | "png" | "webp" | "avif",
): Promise<Sharp> {
  let img = sharp(inputPath).resize({
    width,
    height,
    fit: "fill",
  });

  if (format) {
    img = img.toFormat(format);
  }

  return img;
}
