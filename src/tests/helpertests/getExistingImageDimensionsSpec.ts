import path from "path";
import fs from "fs/promises";
import { getExistingImageDimensions } from "../../helpers/getExistingImageDimensions";

describe("getExistingImageDimensions", () => {
  const validImage = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "images",
    "fjord.jpg"
  );
  const invalidImage = path.join(__dirname, "nonexistent.jpg");

  it("returns correct dimensions for a valid image", async () => {
    const { width, height } = await getExistingImageDimensions(validImage);

    expect(typeof width).toBe("number");
    expect(typeof height).toBe("number");
    expect(width).toBe(1920);
    expect(height).toBe(1280);
  });

  it("throws an error if the image file does not exist", async () => {
    await expectAsync(
      getExistingImageDimensions(invalidImage)
    ).toBeRejectedWithError(/Input file is missing/i);
  });

  it("throws an error if metadata lacks dimensions", async () => {
    const dummyFile = path.join(__dirname, "dummy.txt");
    await fs.writeFile(dummyFile, "not an image");

    await expectAsync(
      getExistingImageDimensions(dummyFile)
    ).toBeRejectedWithError(/unsupported image format/i);

    await fs.unlink(dummyFile);
  });
});
