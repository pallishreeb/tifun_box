import express from "express";
import prisma from "./config/prisma";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
