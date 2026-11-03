import { Router } from "express";
import {
  getAttendanceForDate,
  clockIn,
  clockOut,
  correctAttendance,
  removeAttendance,
} from "../controllers/attendance.controller.js";

export const attendanceRouter = Router();

attendanceRouter.get("/", getAttendanceForDate);
attendanceRouter.post("/clock-in", clockIn);
attendanceRouter.put("/:id/clock-out", clockOut);
attendanceRouter.put("/:id", correctAttendance); attendanceRouter.delete("/:id", removeAttendance);