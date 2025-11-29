import express from "express";
import imagesApi from "./api/imageApi";
import { setupSwagger } from "./swagger";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", imagesApi);

setupSwagger(app);

export default app;
