
import type { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { students } from "../db/schema.js";
import { studentSchema, studentUpdateSchema } from "../lib/validators.js";

// GET /api/students?search=jane
export async function getStudents(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const rows = search
    ? await db.select().from(students).where(ilike(students.fullNames, `%${search}%`))
    : await db.select().from(students);

  res.json(rows);
}

// GET /api/students/:id
export async function getStudentById(req: Request, res: Response) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.studentId, req.params.id));

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.json(student);
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

// PUT /api/students/:id
export async function updateStudent(req: Request, res: Response) {
  const parsed = studentUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [student] = await db
    .update(students)
    .set(parsed.data)
    .where(eq(students.studentId, req.params.id))
    .returning();

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.json(student);
}

// DELETE /api/students/:id
export async function deleteStudent(req: Request, res: Response) {
  const [student] = await db
    .delete(students)
    .where(eq(students.studentId, req.params.id))
    .returning();

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.status(201).send("Student deleted!");
}