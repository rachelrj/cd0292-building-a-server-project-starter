import path from "path";
import { getOrSetCachedResizedImage } from "../../helpers/getOrSetInCacheResizedImage";
import { imageCache } from "../../cache/imageCache";
import * as imageResizer from "../../services/imageResizer";
import { ImageFormatSharp } from "../../types/imageTypes";

describe("getOrSetCachedResizedImage", () => {
  const DUMMY_IMAGE_PATH = path.join(
    __dirname,
    "..",
    "..",
    "images",
    "fjord.jpg"
  );
  const width = 200;
  const height = 200;
  const format: ImageFormatSharp = "jpeg";

  beforeEach(() => {
    imageCache.clear();
  });

  it("on first call, misses cache, calls resizeAndConvert, and stores result", async () => {
    const fakeBuffer = Buffer.from("fake-image-buffer-1");

    const resizeSpy = spyOn(imageResizer, "resizeAndConvert").and.callFake(
      async () =>
        ({
          toBuffer: async () => fakeBuffer,
        }) as any
    );

    const result = await getOrSetCachedResizedImage({
      originalPath: DUMMY_IMAGE_PATH,
      width,
      height,
      format,
    });

    expect(resizeSpy).toHaveBeenCalledTimes(1);
    expect(resizeSpy).toHaveBeenCalledWith(
      DUMMY_IMAGE_PATH,
      width,
      height,
      format
    );

    expect(result).toBe(fakeBuffer);

    const cacheKey = `${DUMMY_IMAGE_PATH}:${width}x${height}:${format}`;
    const cached = imageCache.get(cacheKey);
    expect(cached).toBe(fakeBuffer);
  });

  it("on second call with same options, hits cache and does not call resizeAndConvert again", async () => {
    const fakeBuffer = Buffer.from("fake-image-buffer-2");

    const resizeSpy = spyOn(imageResizer, "resizeAndConvert").and.callFake(
      async () =>
        ({
          toBuffer: async () => fakeBuffer,
        }) as any
    );

    const firstResult = await getOrSetCachedResizedImage({
      originalPath: DUMMY_IMAGE_PATH,
      width,
      height,
      format,
    });

    const secondResult = await getOrSetCachedResizedImage({
      originalPath: DUMMY_IMAGE_PATH,
      width,
      height,
      format,
    });

    expect(resizeSpy).toHaveBeenCalledTimes(1);

    expect(firstResult).toBe(fakeBuffer);
    expect(secondResult).toBe(fakeBuffer);
  });
});
