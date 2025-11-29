import fs from "fs";
import path from "path";
import { parse } from "yaml";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "swaggerDocs",
    "image-api.yaml"
  );

  const fileContents = fs.readFileSync(filePath, "utf8");
  const swaggerDocument = parse(fileContents);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
