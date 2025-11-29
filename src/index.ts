import express from "express";
import imagesApi from "./api/imageApi";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", imagesApi);

setupSwagger(app);

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Swagger docs at http://localhost:3000/docs");
});
