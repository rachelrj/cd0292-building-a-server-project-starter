import request from "supertest";
import app from "../../app";
import * as cacheHelper from "../../helpers/getOrSetInCacheResizedImage";

describe("findOriginalImages", () => {
  it("should return 404 when the image does not exist", async () => {
    const cacheSpy = spyOn(cacheHelper, "getOrSetCachedResizedImage");

    const response = await request(app).get(
      "/image/this-image-does-not-exist.jpg",
    );

    expect(response.status).toBe(404);
    expect(cacheSpy).not.toHaveBeenCalled();
  });
  it("should return 200 and an image buffer when the image name without extension exists", async () => {
    const cacheSpy = spyOn(cacheHelper, "getOrSetCachedResizedImage");
    const response = await request(app).get("/image/fjord");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^image\//);
    expect(response.body).toBeInstanceOf(Buffer);
    expect(cacheSpy).not.toHaveBeenCalled();
  });
  it("should return 200 and an image buffer when the image name with extension exists", async () => {
    const cacheSpy = spyOn(cacheHelper, "getOrSetCachedResizedImage");
    const response = await request(app).get("/image/icelandwaterfall");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^image\//);
    expect(response.body).toBeInstanceOf(Buffer);
    expect(cacheSpy).not.toHaveBeenCalled();
  });
});
