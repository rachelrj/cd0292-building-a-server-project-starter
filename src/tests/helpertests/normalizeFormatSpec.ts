import { normalizeFormat } from "../../helpers/normalizeFormat";

describe("normalizeFormat", () => {
  it("normalizes 'jpg' to 'jpeg'", () => {
    expect(normalizeFormat("jpg")).toBe("jpeg");
    expect(normalizeFormat("JPG")).toBe("jpeg");
    expect(normalizeFormat(".jpg")).toBe("jpeg");
    expect(normalizeFormat(".JPG")).toBe("jpeg");
  });

  it("passes through supported formats unchanged (case-insensitive, with or without dot)", () => {
    expect(normalizeFormat("jpeg")).toBe("jpeg");
    expect(normalizeFormat("JPEG")).toBe("jpeg");
    expect(normalizeFormat(".jpeg")).toBe("jpeg");

    expect(normalizeFormat("png")).toBe("png");
    expect(normalizeFormat("PNG")).toBe("png");
    expect(normalizeFormat(".png")).toBe("png");

    expect(normalizeFormat("webp")).toBe("webp");
    expect(normalizeFormat(".WEBP")).toBe("webp");

    expect(normalizeFormat("avif")).toBe("avif");
    expect(normalizeFormat(".AvIf")).toBe("avif");
  });

  it("defaults to 'jpeg' for unsupported formats", () => {
    expect(normalizeFormat("gif")).toBe("jpeg");
    expect(normalizeFormat(".tiff")).toBe("jpeg");
    expect(normalizeFormat("")).toBe("jpeg");
    expect(normalizeFormat(".")).toBe("jpeg");
    expect(normalizeFormat("random")).toBe("jpeg");
  });
});
