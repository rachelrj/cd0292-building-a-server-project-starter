import request from "supertest";
import app from "../../app";

import * as cacheHelper from "../../helpers/getOrSetInCacheResizedImage";
import * as findOriginalImageModule from "../../helpers/findOriginalImage";
import * as dimHelper from "../../helpers/getExistingImageDimensions";

describe("GET /image/:name", () => {
  it("returns 200 and original image when no resize/format params are provided", async () => {
    const res = await request(app).get("/image/fjord.jpg");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/^image\//);
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it("returns 400 when width is not a number", async () => {
    const res = await request(app).get("/image/fjord.jpg?width=abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Width must be a number" });
  });

  it("returns 400 when height is not a number", async () => {
    const res = await request(app).get("/image/fjord.jpg?height=abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Height must be a number" });
  });

  it("returns 404 when image does not exist and does not hit cache", async () => {
    const findSpy = spyOn(
      findOriginalImageModule,
      "findOriginalImage",
    ).and.rejectWith(new Error("Original image not found for 'nope.jpg'"));

    const cacheSpy = spyOn(
      cacheHelper,
      "getOrSetCachedResizedImage",
    ).and.callThrough();

    const res = await request(app).get("/image/nope.jpg");

    expect(findSpy).toHaveBeenCalled();
    expect(cacheSpy).not.toHaveBeenCalled();
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Original image not found");
  });

  it("calls cache helper when resize/format is requested", async () => {
    const originalPath = "/fake/path/fjord.jpg";

    spyOn(findOriginalImageModule, "findOriginalImage").and.resolveTo(
      originalPath,
    );

    spyOn(dimHelper, "getExistingImageDimensions").and.resolveTo({
      width: 1920,
      height: 1080,
    });

    const fakeBuffer = Buffer.from("fake-resized-image");
    const cacheSpy = spyOn(
      cacheHelper,
      "getOrSetCachedResizedImage",
    ).and.resolveTo(fakeBuffer);

    const res = await request(app).get(
      "/image/fjord.jpg?width=300&height=200&format=webp",
    );

    expect(cacheSpy).toHaveBeenCalledWith({
      originalPath,
      width: 300,
      height: 200,
      format: "webp",
    });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/webp");
    expect(res.body).toEqual(fakeBuffer);
  });

  it("normalizes jpg to jpeg in format query param", async () => {
    const originalPath = "/fake/path/fjord.jpg";

    spyOn(findOriginalImageModule, "findOriginalImage").and.resolveTo(
      originalPath,
    );

    spyOn(dimHelper, "getExistingImageDimensions").and.resolveTo({
      width: 1920,
      height: 1080,
    });

    const fakeBuffer = Buffer.from("fake-jpeg-image");
    const cacheSpy = spyOn(
      cacheHelper,
      "getOrSetCachedResizedImage",
    ).and.resolveTo(fakeBuffer);

    const res = await request(app).get(
      "/image/fjord.jpg?width=500&height=500&format=jpg",
    );

    expect(cacheSpy).toHaveBeenCalledWith({
      originalPath,
      width: 500,
      height: 500,
      format: "jpeg",
    });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/jpeg");
    expect(res.body).toEqual(fakeBuffer);
  });

  it("returns 500 when an unexpected error happens", async () => {
    spyOn(findOriginalImageModule, "findOriginalImage").and.rejectWith(
      new Error("Unexpected boom"),
    );

    const res = await request(app).get("/image/fjord.jpg");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error resizing image");
  });
});
