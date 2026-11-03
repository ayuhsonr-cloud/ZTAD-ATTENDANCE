import { Router } from "express";
import { studentsRouter } from "../././../routes2/student.routes.js";
import { attendanceRouter } from ".././../routes2/attendance.routes.js";
import { settingsRouter } from ".././../routes2/settings.routes.js";


export const apiRouter = Router();

apiRouter.use("/students", studentsRouter);
apiRouter.use("/attendance", attendanceRouter);
apiRouter.use("/settings", settingsRouter);