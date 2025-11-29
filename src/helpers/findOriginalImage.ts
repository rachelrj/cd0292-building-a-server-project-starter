import fs from "fs/promises";
import path from "path";
import { IMAGE_FORMATS_NATURAL, ImageFormatNatural } from "../types/imageTypes";

export async function findOriginalImage(
  name: string,
  imagesDir: string
): Promise<string> {
  const extWithDot = path.extname(name);
  const base = path.basename(name, extWithDot);

  let candidates: string[] = [];

  if (extWithDot) {
    const ext = extWithDot.slice(1).toLowerCase();
    const isSupported = IMAGE_FORMATS_NATURAL.includes(
      ext as ImageFormatNatural
    );

    if (isSupported) {
      candidates = [name];
    } else {
      candidates = IMAGE_FORMATS_NATURAL.map((fmt) => `${base}.${fmt}`);
    }
  } else {
    candidates = IMAGE_FORMATS_NATURAL.map((fmt) => `${base}.${fmt}`);
  }

  const attempted: string[] = [];

  for (const file of candidates) {
    const fullPath = path.join(imagesDir, file);
    attempted.push(fullPath);
    try {
      await fs.access(fullPath);
      return fullPath;
    } catch {}
  }

  throw new Error(`Original image not found`);
}
