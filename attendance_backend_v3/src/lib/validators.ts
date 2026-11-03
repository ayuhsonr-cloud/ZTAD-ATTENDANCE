
 import { z } from "zod";

// // Mirrors the student form (fullNames, track, status).
export const studentSchema = z.object({
  fullNames: z.string().trim().min(1, "Please enter the student's name."),
  track: z.enum(["frontend", "backend"]),
   status: z.enum(["active", "inactive"]).default("active"),
 });
 export type StudentInput = z.infer<typeof studentSchema>;

 export const studentUpdateSchema = studentSchema.partial();

// // Mirrors the clock-in form.
 export const clockInSchema = z.object({
  studentId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
  clockIn: z.string().regex(/^\d{2}:\d{2}$/, "Clock-in must be HH:MM."),
 });
 export type ClockInInput = z.infer<typeof clockInSchema>;

 export const clockOutSchema = z.object({
   clockOut: z.string().regex(/^\d{2}:\d{2}$/, "Clock-out must be HH:MM."),
 });
 export type ClockOutInput = z.infer<typeof clockOutSchema>;

// // Mirrors the correction dialog (clock-in + clock-out together).
 export const correctionSchema = z.object({
   clockIn: z.string().regex(/^\d{2}:\d{2}$/, "Clock-in must be HH:MM."),
  clockOut: z.string().regex(/^\d{2}:\d{2}$/, "Clock-out must be HH:MM.").nullable().optional(),
 });
 export type CorrectionInput = z.infer<typeof correctionSchema>;

// // Mirrors the settings form.
// export const settingsSchema = z.object({
//   workingDays: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one working day."),
//   openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Opening time must be HH:MM."),
//   closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Closing time must be HH:MM."),
// });
// export type SettingsInput = z.infer<typeof settingsSchema>;

export const settingsSchema = z
  .object({
    workingDays: z.array(z.number().int().min(0).max(6))
      .min(1, "Pick at least one working day."),
    openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Opening time must be HH:MM."),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Closing time must be HH:MM."),
  })
  .refine((settings) => settings.closingTime > settings.openingTime, {
    message: "Closing time must be later than opening time.",
    path: ["closingTime"],
  });