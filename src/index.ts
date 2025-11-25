import express from "express";
import imagesApi from "./api/imageApi";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", imagesApi);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
