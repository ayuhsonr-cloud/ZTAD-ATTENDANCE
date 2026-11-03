
import "dotenv/config";
import { db } from "./index.js";
import { settings } from "./schema.js";

async function seed() {
  const existing = await db.select().from(settings).limit(1);

  if (existing.length > 0) {
    console.log("Settings row already exists, nothing to seed.");
    process.exit(0);
  }

  await db.insert(settings).values({
    workingDays: [0, 1, 2, 3, 4],
    openingTime: "09:00",
    closingTime: "17:00",
  });

  console.log("Seeded default settings.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});