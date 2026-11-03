import { Router } from "express";
import { settingsRouter } from "./settings.routes.js";

export const apiRouter = Router();

apiRouter.use("/settings", settingsRouter);
