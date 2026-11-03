
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { settings } from "../src/db/schema.js";
import { settingsSchema } from "../lib/validators.js";
import type { Settings } from "../src/db/schema.js";

// There is always exactly one settings row (id = 1).
export async function getOrCreateSettings(): Promise<Settings> {
  const [existing] = await db.select().from(settings).limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(settings)
    .values({
      workingDays: [0, 1, 2, 3, 4],
      openingTime: "09:00",
      closingTime: "17:00",
    })
    .returning();

  return created;
}

// GET /api/settings
export async function getSettings(_req: Request, res: Response) {
  const current = await getOrCreateSettings();
  res.json(current);
}

// PUT /api/settings
export async function updateSettings(req: Request, res: Response) {
  const parsed = settingsSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const current = await getOrCreateSettings();

  const [updated] = await db
    .update(settings)
    .set(parsed.data)
    .where(eq(settings.id, current.id))
    .returning();

  res.json(updated)};