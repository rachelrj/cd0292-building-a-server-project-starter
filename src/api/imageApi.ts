import { Router, Request, Response } from "express";
import path from "path";
import { getExistingImageDimensions } from "../helpers/getExistingImageDimensions";
import { findOriginalImage } from "../helpers/findOriginalImage";
import { getOrSetCachedResizedImage } from "../helpers/getOrSetInCacheResizedImage";
import { normalizeFormat } from "../helpers/normalizeFormat";

const router = Router();

router.get(
  "/image/:name",
  async (
    req: Request<
      { name: string },
      {},
      {},
      { width?: string; height?: string; format?: string }
    >,
    res: Response
  ) => {
    try {
      const { name } = req.params;
      const IMAGES_DIR = path.join(__dirname, "..", "..", "images");

      const originalPath = await findOriginalImage(name, IMAGES_DIR);

      const { width: origW, height: origH } =
        await getExistingImageDimensions(originalPath);

      let { width, height, format: formatRaw } = req.query;

      let widthNum = width ? Number(width) : undefined;
      let heightNum = height ? Number(height) : undefined;

      if (widthNum !== undefined && Number.isNaN(widthNum)) {
        return res.status(400).json({ error: "Width must be a number" });
      }

      if (heightNum !== undefined && Number.isNaN(heightNum)) {
        return res.status(400).json({ error: "Height must be a number" });
      }

      widthNum = widthNum ?? origW;
      heightNum = heightNum ?? origH;

      const originalExt = normalizeFormat(path.extname(originalPath).slice(1));

      const requestedFormat = formatRaw
        ? normalizeFormat(formatRaw)
        : originalExt;

      if (
        widthNum === origW &&
        heightNum === origH &&
        requestedFormat === originalExt
      ) {
        res.setHeader("Content-Type", `image/${originalExt}`);
        return res.sendFile(originalPath, (err) => {
          if (err) {
            console.error("Error sending original image:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Error sending original image" });
            }
          }
        });
      }

      const buffer = await getOrSetCachedResizedImage({
        originalPath,
        width: widthNum,
        height: heightNum,
        format: requestedFormat,
      });

      res.setHeader("Content-Type", `image/${requestedFormat}`);
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
