
import type { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { studentSchema, studentUpdateSchema } from "../lib/validators.js";
import { students } from "../src/db/schema.js";

// GET /api/students?search=jane
export async function getStudents(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const rows = search
    ? await db.select().from(students).where(ilike(students.fullNames, `%${search}%`))
    : await db.select().from(students);

  res.json(rows);
}

// POST /api/students
export async function createStudent(req: Request, res: Response) {
  const parsed = studentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [student] = await db.insert(students).values(parsed.data).returning();

  res.status(201).json(student);
}