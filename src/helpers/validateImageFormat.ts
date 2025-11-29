import { ImageFormatNatural } from "../types/imageTypes";

export const allowedFormats = ["jpeg", "jpg", "png", "webp", "avif"] as const;

export function isImageFormat(value: unknown): value is ImageFormatNatural {
  return (
    typeof value === "string" &&
    allowedFormats.includes(value as ImageFormatNatural)
  );
}
