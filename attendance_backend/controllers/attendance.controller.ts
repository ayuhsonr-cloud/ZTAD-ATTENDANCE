import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { attendance, students } from "../src/db/schema.js";
import { clockInSchema, clockOutSchema, correctionSchema } from "../lib/validators.js";
import { checkTimes, isWorkingDay, dayName, attendanceStatus, dailyTotal } from "../lib/utilis.js";
import { getOrCreateSettings } from "./settings.controller.js";

// One record for one student on one day.
async function findRecord(studentId: string, date: string) {
  const [record] = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.studentId, studentId), eq(attendance.date, date)));

  return record ?? null;
}

// GET /api/attendance?date=YYYY-MM-DD&search=jane
export async function getAttendanceForDate(req: Request, res: Response) {
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";

  if (!date) {
    return res.status(400).json({ error: "Please pick a date first." });
  }

  const settings = await getOrCreateSettings();

  const activeStudents = await db.select().from(students).where(eq(students.status, "active"));
  const dayRecords = await db.select().from(attendance).where(eq(attendance.date, date));

  const filtered = search
    ? activeStudents.filter((student) =>
        `${student.fullNames} ${student.track}`.toLowerCase().includes(search),
      )
    : activeStudents;

  const rows = filtered.map((student) => {
    const record = dayRecords.find((r) => r.studentId === student.studentId) ?? null;

    return {
      student,
      record,
      status: attendanceStatus(record),
      total: dailyTotal(record),
    };
  });

  const stillIn = dayRecords.filter((record) => !record.clockOut);

  res.json({
    date,
    isWorkingDay: isWorkingDay(date, settings),
    dayName: dayName(date),
    notice: isWorkingDay(date, settings)
      ? `${dayRecords.length} clocked in on ${date}, ${stillIn.length} still in.`
      : `${dayName(date)} is not a working day, so nobody can be clocked in.`,
    rows,
  });
}

// POST /api/attendance/clock-in
export async function clockIn(req: Request, res: Response) {
  const parsed = clockInSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { studentId, date, clockIn: clockInTime } = parsed.data;

  const settings = await getOrCreateSettings();
  const error = checkTimes(date, clockInTime, null, settings);

  if (error) {
    return res.status(400).json({ error });
  }

  const existing = await findRecord(studentId, date);

  if (existing) {
    return res.status(409).json({ error: "This student is already clocked in for that date." });
  }

  const [record] = await db
    .insert(attendance)
    .values({ studentId, date, clockIn: clockInTime })
    .returning();

  res.status(201).json(record);
}