import path from "path";
import sharp from "sharp";
import { getOrSetCachedResizedImage } from "../../helpers/getOrSetInCacheResizedImage";
import * as imageResizer from "../../services/imageResizer";
import { ImageFormatSharp } from "../../types/imageTypes";

type FakeSharp = {
  toBuffer: () => Promise<Buffer>;
};

describe("getOrSetCachedResizedImage", () => {
  const DUMMY_IMAGE_PATH = path.join(process.cwd(), "images", "fjord.jpg");
  const format: ImageFormatSharp = "jpeg";

  it("on first call, calls resizeAndConvert and returns the buffer", async () => {
    const fakeBuffer = Buffer.from("fake-image-buffer-1");

    const resizeSpy = spyOn(imageResizer, "resizeAndConvert").and.callFake(
      async (): Promise<FakeSharp & sharp.Sharp> =>
        ({
          toBuffer: async () => fakeBuffer,
        }) as unknown as FakeSharp & sharp.Sharp,
    );

    const result = await getOrSetCachedResizedImage({
      originalPath: DUMMY_IMAGE_PATH,
      width: 200,
      height: 200,
      format,
    });

    expect(resizeSpy).toHaveBeenCalledTimes(1);
    expect(resizeSpy).toHaveBeenCalledWith(DUMMY_IMAGE_PATH, 200, 200, format);
    expect(result).toBe(fakeBuffer);
  });

  it("on second call with same options, uses the cached buffer and does not call resizeAndConvert again", async () => {
    const fakeBuffer = Buffer.from("fake-image-buffer-2");

    const resizeSpy = spyOn(imageResizer, "resizeAndConvert").and.callFake(
      async (): Promise<FakeSharp & sharp.Sharp> =>
        ({
          toBuffer: async () => fakeBuffer,
        }) as unknown as FakeSharp & sharp.Sharp,
    );

    const width = 300;
    const height = 300;

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
