import { ImageFormatSharp } from "../types/imageTypes";

export function normalizeFormat(ext: string): ImageFormatSharp {
  const clean = ext.toLowerCase().replace(".", "");

  if (clean === "jpg") return "jpeg"; // normalize jpg → jpeg (for Sharp)

  if (["jpeg", "png", "webp", "avif"].includes(clean)) {
    return clean as ImageFormatSharp;
  }

  return "jpeg";
}
