
import type { Settings } from "../db/schema.js";

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// YYYY-MM-DD for today.
export function today(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// getDay() gives 0 for Sunday, but working days start on Monday,
// so shift by six and wrap round with %.
export function weekdayNumber(date: string): number {
  const day = new Date(`${date}T00:00`).getDay();
  return (day + 6) % 7;
}

export function dayName(date: string): string {
  return DAY_NAMES[weekdayNumber(date)];
}

export function isWorkingDay(date: string, settings: Settings): boolean {
  return settings.workingDays.includes(weekdayNumber(date));
}

// "08:15" becomes 495, minutes since midnight.
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

// 510 becomes "8h 30m".
export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Clock out minus clock in. No clock out yet means no total.
export function dailyTotal(record: { clockIn: string; clockOut: string | null } | null): string {
  if (!record || !record.clockOut) {
    return "—";
  }

  return formatMinutes(timeToMinutes(record.clockOut) - timeToMinutes(record.clockIn));
}

// No record yet, still in, or done for the day.
export function attendanceStatus(record: { clockOut: string | null } | null): string {
  if (!record) {
    return "Not clocked in";
  }

  if (!record.clockOut) {
    return "Currently in";
  }

  return "Completed";
}

// The time rules every form checks. Returns "" if valid, else a message.
export function checkTimes(
  date: string,
  clockIn: string,
  clockOut: string | null | undefined,
  settings: Settings,
): string {
  if (!date) {
    return "Please pick a date first.";
  }

  const todayDate = today();

  if (date > todayDate) {
    return "You cannot record attendance for a future date.";
  }

  if (date < todayDate) {
    return "You cannot record attendance for a past date.";
  }

  if (!isWorkingDay(date, settings)) {
    return `${dayName(date)} is not a working day. You can change that in Settings.`;
  }

  if (!clockIn) {
    return "Please enter a clock-in time.";
  }

  if (clockIn < settings.openingTime || clockIn > settings.closingTime) {
    return `Clock-in must be between ${settings.openingTime} and ${settings.closingTime}.`;
  }

  if (clockOut) {
    if (clockOut > settings.closingTime) {
      return `Clock-out cannot be later than ${settings.closingTime}.`;
    }

    if (clockOut <= clockIn) {
      return "Clock-out must be later than the clock-in time.";
    }
  }

  return "";
}