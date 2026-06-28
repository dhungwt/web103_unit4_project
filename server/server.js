import express from "express";
import path from "path";
import favicon from "serve-favicon";
import dotenv from "dotenv";
import parksRouter from "./routes/parks.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/parks", parksRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">🎡 🎢 🎠 🎟️ 🍿 🎪 🎠 🎡 🎢 🍿 🎫 🎪Dream Park🎠 API</h1>',
    );
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
