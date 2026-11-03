import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ message: "Welcome to the system" });
});

app.use("/api", apiRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});