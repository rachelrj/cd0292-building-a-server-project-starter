import { ImageFormat } from "../types/imageTypes";

export const allowedFormats = ["jpeg", "png", "webp", "avif"] as const;

export function isImageFormat(value: unknown): value is ImageFormat {
  return (
    typeof value === "string" && allowedFormats.includes(value as ImageFormat)
  );
}
