import { Router } from "express";
import { studentsRouter } from "./students.routes.js";
import { attendanceRouter } from "./attendance.routes.js";
import { settingsRouter } from "./settings.routes.js";

export const apiRouter = Router();

apiRouter.use("/students", studentsRouter);
apiRouter.use("/attendance", attendanceRouter);
apiRouter.use("/settings", settingsRouter);
