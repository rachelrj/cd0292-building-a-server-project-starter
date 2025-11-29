# Image Processing API

This project aims to give you a real-world scenario in which you would read and write to your disk via a Node.js express server rather than a database. The project you create serves two purposes: to prepare you for setting up scalable code and architecture for real-world projects and tie together some of the most popular middleware and utilities found in Node.js projects. This project barely touches the surface of what is possible but will prove your ability to use what you’ve learned in real-world scenarios.

For this project, refactor and test as much as possible while you are building. Since you are using TypeScript and an unfamiliar library, it is sometimes easier to write and build in plain JS to see what your functions return; remember your submission needs to be in TypeScript. As your skills improve, typing in TypeScript will feel more intuitive. Make sure to remove any debugging code from your final submission.

## Getting Started

Usually, you would get some starter code to build from, but with this project, it’s your job to prove you can do it from scratch, so all that is being provided for you is a folder of license-free stock images you are welcome to use. If you would like to use your own images for this project, you are welcome to do so, but whoever reviews your project will see your images, and when you display your project online, viewers will also see them.

You can use your own images or use the ones provided in this repo: [images](images)

## Instructions

Feel free to attempt to create this project based on the overview and rubric specifications. If you get stuck or prefer structured guidance -- here is a walkthrough to get you up and running!

1. **Initialize your project.**
   Add the dependencies required for this project, including Express, TypeScript, Jasmine, Eslint, and Prettier. Complete your package.json file.
   - Where should your dependencies be placed?
   - What scripts should you create to take advantage of the dependencies you've added?
   - Are there other dependencies you would like to add or know you will need to improve your workflow?
2. **Set up your project structure.**
   Create folders and files for what you anticipate you will need for the project.
   - How do you plan to keep your source code and build code separately?
   - Where will you keep your tests?
   - How do you plan to name your routes? Utilities?
3. **Configure your middleware and dependencies.**
   You have quite a few dependencies that all need to work together. Sometimes it's easiest to write some simple js functions to test that all of your dependencies work together before you begin adding any functionality.
   - Does your TypeScript compile?
   - Do your Eslint and Prettier scripts work?
   - Are you able to write and pass

4. **Set up your server and create an API endpoint.** Even though this application is fairly straightforward, you still want to set it up in a scalable way. How can you set up your server and route so that your project remains scalable? Only one endpoint is required. It's best to create this and test that it is working before you move on.

5. **Install [Sharp](https://www.npmjs.com/package/sharp) and configure endpoint.**
   Create a separate module for your processing functionality and import it into your route. You are only required to add resizing, but you may add additional processing if you choose to extend your application. You are only required to work with jpg files, so keep that in mind if you choose to use your own images and they are other formats.
   - Pay close attention to if you need to use asynchronous code or not. If you do, make sure you stay consistent throughout your application.
   - There is limited information on using Sharp with TypeScript, but don't let that be a blocker. Think about what type the Sharp constructor would return. Have a look at the [Sharp Constructor documentation](https://sharp.pixelplumbing.com/api-constructor) and the examples it provides.
6. **Write your tests.**
   If you haven't already been writing unit tests, now would be the time to start. Think about what you should test? At a minimum, you should have at least one test for your endpoint and at least one test for your image processing, but there are many different tests you could create.
7. **Add caching.**
   Add caching to your application so that repeated requests to your endpoint use pre-stored images rather than regenerating a new image each time.
8. **Test, Debug, and Refactor.**
   Think of edge-cases for your project and how someone may access your project. Should they get different error messages based on what's wrong? Make certain that your user isn't left in the dark when something goes wrong.
   - Do all of your tests still pass?
   - Does stopping and restarting your server cause any issues?
   - Does your user get feedback when something goes wrong?
   - Is your code easy to follow? Comments?
   - Is your API production-ready?
9. **Build, Document, and Submit.**
   If everything else has gone well, you should be able to compile your typescript and start up your production server to test that everything still works as expected. Make sure you've provided all necessary information in your readme file, so your reviewer knows how to test your API. If everything works and your documentation is complete, you're ready to submit!
   **_Congratulations!_**

## Version Control

Although not a requirement, we recommend using Git from the very beginning if you choose to build on your local environment or use the provided workspace. Make sure to commit often and to use well-formatted commit messages.

## Caching Behavior

This project uses an **in-memory LRU cache** (via the `lru-cache` package).  
Cached images are **not saved to disk**, and no `/cache` folder is required.

Each resized or converted image is stored as a `Buffer` inside the running
process and keyed by:

{originalPath}:{width}x{height}:{format}

Because caching is memory-based:

- Cached images are extremely fast to return
- Cache entries are automatically evicted based on size limits
- All cached items are cleared when the server restarts
- No folders or disk writes are involved

### Verifying Caching Behavior

This project includes automated tests that confirm the caching system works correctly.  
Because the cache is implemented entirely in memory using **lru-cache**, you won't see any files written to a `/cache` directory. Instead, the tests validate caching by checking how many times the image-processing function is actually called.

Specifically:

- On the **first request**, the image is processed through Sharp, and the result is stored in the in-memory cache.
- On the **second request with identical parameters**, the cached Buffer is returned instantly — **without calling Sharp again**.

The test suite verifies this by:

1. **Spying on `resizeAndConvert`** (the Sharp wrapper function)
2. Making two identical calls to `getOrSetCachedResizedImage`
3. Asserting that:
   - The first call produces a cache miss and calls Sharp once
   - The second call produces a cache hit and does **not** call Sharp again

Because these tests run automatically using Jasmine, you can rely on them to confirm that caching is functioning exactly as intended. The behavior is fully covered even though the cache exists only in memory and not on disk.

## API Documentation (Swagger UI)

> _Student Note:_  
> To make the API easier to explore, understand, and test, I added interactive **Swagger UI documentation** to this project.

Once the server is running, you can access the API docs at:

👉 **http://localhost:3000/docs**

The Swagger page includes:

- A **Health Check** endpoint (`GET /health`)
- The full **Image Processing Endpoint** (`GET /image/{name}`)
- All supported query parameters (`width`, `height`, `format`)
- Example success and error responses
- The ability to visually test the API directly in the browser

The documentation is generated from an OpenAPI YAML file.

## API Reference

This section mirrors the OpenAPI (Swagger) specification for the Image Resizer API in Markdown.

---

### General Info

- **Title:** Image Resizer API
- **Version:** 1.0.0
- **Description:** Simple health check and image resize/format conversion service.
- **Server (local dev):**
  - `http://localhost:3000`

---

##### `GET /health`

**Summary:** Health check  
**Description:** Returns basic service health status.

##### Request

- **Method:** `GET`
- **URL:** `http://localhost:3000/health`
- **Path parameters:** None
- **Query parameters:** None
- **Request body:** None

##### Responses

###### `200 OK`

- **Description:** Service is healthy.
- **Content-Type:** `application/json`
- **Schema:** `HealthResponse`

Example:

```json
{
  "status": "ok"
}
```

#### GET `/image/{name}`

##### 📌 Summary

Retrieve an image — optionally **resized** or **converted**.

##### 📄 Description

This endpoint returns an image by filename. It supports:

- Resizing via `width` and/or `height`
- Format conversion via `format`
- Automatic passthrough of the **original file** if no transformation is needed
- Requests **with or without** file extensions

---

##### 🔗 Request

#### **Method:** `GET`

#### **URL:**

---

#### 🔸 Path Parameters

| Name   | Type   | Required | Description                               | Example   |
| ------ | ------ | -------- | ----------------------------------------- | --------- |
| `name` | string | yes      | Image filename, with or without extension | `cat.jpg` |

---

#### 🔸 Query Parameters

| Name     | Type    | Required | Description                        | Constraints                                                                 | Example |
| -------- | ------- | -------- | ---------------------------------- | --------------------------------------------------------------------------- | ------- |
| `width`  | integer | no       | Desired width in pixels            | `>= 1`                                                                      | `800`   |
| `height` | integer | no       | Desired height in pixels           | `>= 1`                                                                      | `600`   |
| `format` | string  | no       | Output format (resizes + converts) | One of: `jpeg`, `png`, `webp`, `avif`, `jpg` (`jpg` → normalized to `jpeg`) | `webp`  |

#### Responses

##### `200 OK`

Returns the image in binary form.

##### `400 Bad Request`

Description: Invalid query parameters (e.g. non-numeric width/height).

```
{
  "error": "Width must be a number"
}
```

##### `404 Not Found`

Description: Image not found.

```
{
  "error": "Original image not found for 'cat.jpg'"
}
```

##### `500 Internal Server Error`

Description: Server error while resizing/serving image.

```
{
  "error": "Error resizing image"
}
```

---

## License

[License](LICENSE.txt)
