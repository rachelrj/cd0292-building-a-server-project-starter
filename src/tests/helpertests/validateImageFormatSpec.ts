import {
  isImageFormat,
  allowedFormats,
} from "../../helpers/validateImageFormat";

describe("isImageFormat", () => {
  it("returns true for all allowed formats", () => {
    for (const fmt of allowedFormats) {
      expect(isImageFormat(fmt)).toBeTrue();
    }
  });

  it("returns false for strings not in allowed formats", () => {
    const invalidValues = [
      "gif",
      "bmp",
      "tiff",
      "JPEG",
      "PNG",
      "webP",
      "",
      "   ",
    ];

    for (const value of invalidValues) {
      expect(isImageFormat(value)).toBeFalse();
    }
  });

  it("returns false for non-string values", () => {
    const values = [null, undefined, 123, {}, [], true, false];

    for (const value of values) {
      expect(isImageFormat(value)).toBeFalse();
    }
  });

  it("narrows the TypeScript type to ImageFormatNatural", () => {
    const value: unknown = "jpeg";

    if (isImageFormat(value)) {
      // Inside this block, TS should treat `value` as ImageFormatNatural
      const typedValue: import("../../types/imageTypes").ImageFormatNatural =
        value;
      expect(typedValue).toBe("jpeg");
    } else {
      fail("Type guard did not recognize a valid format");
    }
  });
});
