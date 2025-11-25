import { Router, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { ResizedImage, ImageFormat } from "../types/imageTypes";
import { resizeAndConvert } from "../services/imageResizer";
import { isImageFormat } from "../helpers/validateImageFormat";
import { getExistingImageDimensions } from "../helpers/getExistingImageDimensions";
import { Sharp } from "sharp";

const router = Router();

router.get(
  "/image/:name",
  async (
    req: Request<
      { name: string },
      {},
      {},
      { width?: number; height?: number; format?: string }
    >,
    res: Response
  ) => {
    try {
      const { name } = req.params;

      let { width, height, format: formatRaw } = req.query;

      const IMAGES_DIR = path.join(__dirname, "..", "..", "images");
      const originalPath = path.join(IMAGES_DIR, name);

      try {
        await fs.access(originalPath);
      } catch {
        return res
          .status(404)
          .json({ error: `Image '${name}' does not exist in /images folder` });
      }

      if (height == null || width == null) {
        const { height: origH, width: origW } =
          await getExistingImageDimensions(originalPath);

        height = height ?? origH;
        width = width ?? origW;
      }

      const format = isImageFormat(formatRaw)
        ? (formatRaw as ImageFormat)
        : undefined;

      const resized: Sharp = await resizeAndConvert(
        originalPath,
        width,
        height,
        format
      );

      const buffer = await resized.toBuffer();

      res.setHeader("Content-Type", `image/${format ?? "png"}`);
      return res.send(buffer);
    } catch (err: unknown) {
      console.error(err);

      if (
        err instanceof Error &&
        err.message.includes("Original image not found")
      ) {
        return res.status(404).json({ error: err.message });
      }

      return res.status(500).json({ error: "Error resizing image" });
    }
  }
);

export default router;
