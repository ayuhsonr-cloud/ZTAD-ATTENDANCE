import { pgTable, uuid, text, date, jsonb, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// The two "tracks" and "statuses" the frontend selects use.
export const trackEnum = pgEnum("track", ["frontend", "backend"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);

// One row per student.
export const students = pgTable("students", {
  studentId: uuid("student_id").primaryKey().defaultRandom(),
  fullNames: text("full_names").notNull(),
  track: trackEnum("track").notNull(),
  status: statusEnum("status").notNull().default("active"),
});

// One row per student per day.
export const attendance = pgTable("attendance", {
  attendanceId: uuid("attendance_id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.studentId, { onDelete: "cascade" }),
  // Stored as YYYY-MM-DD.
  date: date("date", { mode: "string" }).notNull(),
  // Stored as HH:MM text, same format the <input type="time"> fields use.
  clockIn: text("clock_in").notNull(),
  clockOut: text("clock_out"),
});

// Always exactly one row (id = 1).
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  // 0 = Monday ... 6 = Sunday.
  workingDays: jsonb("working_days").$type<number[]>().notNull().default([0, 1, 2, 3, 4]),
  openingTime: text("opening_time").notNull().default("09:00"),
  closingTime: text("closing_time").notNull().default("17:00"),
});

export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.studentId],
  }),
}));

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type NewAttendanceRecord = typeof attendance.$inferInsert;
export type Settings = typeof settings.$inferSelect;