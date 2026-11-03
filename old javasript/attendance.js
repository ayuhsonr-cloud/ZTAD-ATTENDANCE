// ============================================================
// attendance.js — Attendance page logic
// ============================================================

// ---- element references ----
const attendanceDate = document.querySelector("#attendance-date");
const attendanceSearch = document.querySelector("#attendance-search");
const attendanceBody = document.querySelector("#attendance-body");
const clockInDialog = document.querySelector("#clock-in-dialog");
const clockInForm = document.querySelector("#clock-in-form");
const clockInStudent = document.querySelector("#clock-in-student");
const clockInTime = document.querySelector("#clock-in-time");
const clockInError = document.querySelector("#clock-in-error");
const clockInBtn = document.querySelector("#clockin-btn");
const settingsBtn = document.querySelector("#settings-btn");

const clockOutDialog = document.querySelector("#clock-out-dialog");
const clockOutForm = document.querySelector("#clock-out-form");
const clockOutInfo = document.querySelector("#clock-out-info");
const clockOutTime = document.querySelector("#clock-out-time");
const clockOutError = document.querySelector("#clock-out-error");

const settingsDialog = document.querySelector("#settings-dialog");
const settingsForm = document.querySelector("#settings-form");
const openTimeInput = document.querySelector("#open-time");
const closeTimeInput = document.querySelector("#close-time");
const settingsError = document.querySelector("#settings-error");

// ---- data ----
let attendanceList = [];
let studentBeingClockedOut = null; // studentId currently in the clock-out dialog

// FIX: Monday-first working days (0=Mon ... 6=Sun) and open/close times,
// persisted separately from the raw attendance records.
let settings = {
  workingDays: [0, 1, 2, 3, 4], // Mon-Fri by default
  openTime: "08:00",
  closeTime: "17:00",
};

const ATTENDANCE_KEY = "all_attendance";
const SETTINGS_KEY = "attendance_settings";

// ---- id + date/time helpers ----
function createAttendanceId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // FIX: use the built-in random id generator
}

// FIX: String/padStart capitalisation, correct padding character
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function today() {
  return formatDate(new Date());
}

function nowTime() {
  return formatTime(new Date());
}

// FIX: convert the browser's Sunday-first getDay() into this app's
// Monday-first numbering: add 6, then take remainder after dividing by 7.
function mondayFirstWeekday(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (date.getDay() + 6) % 7;
}

function isWorkingDay(dateStr) {
  return settings.workingDays.includes(mondayFirstWeekday(dateStr));
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// ---- localStorage: attendance records ----
function saveAttendance() {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceList));
}

function loadAttendance() {
  const saved = localStorage.getItem(ATTENDANCE_KEY);
  if (!saved) {
    return;
  }
  try {
    attendanceList = JSON.parse(saved);
  } catch (error) {
    console.log("Could not read attendance.", error);
    attendanceList = []; // FIX: never let a broken value overwrite good data silently
  }
}

// ---- localStorage: settings ----
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) {
    return;
  }
  try {
    const parsed = JSON.parse(saved);
    if (
      Array.isArray(parsed.workingDays) &&
      parsed.workingDays.length > 0 &&
      typeof parsed.openTime === "string" &&
      typeof parsed.closeTime === "string" &&
      parsed.openTime < parsed.closeTime
    ) {
      settings = parsed;
    }
  } catch (error) {
    console.log("Could not read settings, using defaults.", error);
  }
}

// ---- read students saved by the Students page ----
function getStudents() {
  const saved = localStorage.getItem("all_students");
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.log("Could not read students.", error);
    return [];
  }
}

function findRecord(studentId, date) {
  return attendanceList.find(
    (record) => record.studentId === studentId && record.date === date
  );
}

// ---- status calculation (README section 8) ----
function getStatus(record, dateStr) {
  if (record && record.clockOut) return "Completed";
  if (record) return "Currently in";

  if (!isWorkingDay(dateStr)) return "Not scheduled";

  const todayStr = today();
  if (dateStr > todayStr) return "Upcoming";

  if (dateStr < todayStr) return "Absent";

  // dateStr === todayStr, no record yet
  const nowMinutes = toMinutes(nowTime());
  const openMinutes = toMinutes(settings.openTime);
  const closeMinutes = toMinutes(settings.closeTime);

  if (nowMinutes < openMinutes) return "Not started";
  if (nowMinutes < closeMinutes) return "Not clocked in";
  return "Absent"; // today, after closing, never clocked in
}

// ---- reconciliation: auto-close records left open (README section 8) ----
function reconcileOpenRecords() {
  const todayStr = today();
  const nowMinutes = toMinutes(nowTime());
  let changed = false;

  attendanceList.forEach((record) => {
    if (record.clockOut) return; // already closed

    const isPastDay = record.date < todayStr;
    const isTodayPastClosing =
      record.date === todayStr &&
      toMinutes(record.scheduledCloseTime || settings.closeTime) <= nowMinutes;

    if (isPastDay || isTodayPastClosing) {
      record.clockOut = record.scheduledCloseTime || settings.closeTime;
      record.autoClosed = true;
      changed = true;
    }
  });

  if (changed) {
    saveAttendance(); // FIX: save once after checking them all
  }
}

// ---- rendering ----
function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.append(cell);
}

function renderAttendance() {
  attendanceBody.replaceChildren();
  const date = attendanceDate.value;
  const searchText = attendanceSearch.value.trim().toLowerCase();

  getStudents()
    .filter(
      (student) =>
        student.fullNames.toLowerCase().includes(searchText) ||
        student.track.toLowerCase().includes(searchText)
    )
    .forEach((student, index) => {
      const row = document.createElement("tr");
      const record = findRecord(student.studentId, date);
      const status = getStatus(record, date);

      addCell(row, String(index + 1).padStart(3, "0"));
      addCell(row, student.fullNames);
      addCell(row, student.track);
      addCell(row, status);
      addCell(row, record ? record.clockIn : "—");
      addCell(row, record && record.clockOut ? record.clockOut : "—");
      addCell(
        row,
        record && record.clockOut
          ? formatDuration(toMinutes(record.clockOut) - toMinutes(record.clockIn))
          : "—"
      );

      // FIX: 8th column — actions, previously missing entirely
      const actionsCell = document.createElement("td");
      if (status === "Currently in") {
        const clockOutBtn = document.createElement("button");
        clockOutBtn.type = "button";
        clockOutBtn.className = "table-action";
        clockOutBtn.textContent = "Clock out";
        clockOutBtn.addEventListener("click", () =>
          openClockOutDialog(student, record)
        );
        actionsCell.append(clockOutBtn);
      }
      row.append(actionsCell);

      attendanceBody.append(row);
    });
}

// ---- clock-in dialog ----
clockInBtn.addEventListener("click", function () {
  const date = attendanceDate.value;

  clockInStudent.replaceChildren();
  getStudents()
    .filter((student) => !findRecord(student.studentId, date))
    .forEach((student) => {
      const option = document.createElement("option");
      option.value = student.studentId;
      option.textContent = student.fullNames;
      clockInStudent.append(option);
    });

  if (clockInStudent.options.length === 0) {
    clockInError.textContent = "Every student already has a record for this date.";
  } else {
    clockInError.textContent = "";
  }

  clockInTime.value = nowTime(); // FIX: prefill with current time
  clockInDialog.showModal();
});

clockInDialog
  .querySelector("[data-close]")
  .addEventListener("click", () => clockInDialog.close());

clockInForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const studentId = clockInStudent.value;
  const date = attendanceDate.value;
  const time = clockInTime.value;

  if (!studentId || !time) {
    clockInError.textContent = "Please choose a student and a time.";
    return;
  }

  if (!isWorkingDay(date)) {
    clockInError.textContent = "This date is not a working day.";
    return;
  }

  if (date !== today()) {
    clockInError.textContent = "You can only clock in for today.";
    return;
  }

  const minutes = toMinutes(time);
  if (
    minutes < toMinutes(settings.openTime) ||
    minutes >= toMinutes(settings.closeTime)
  ) {
    clockInError.textContent = "Clock-in time must be within working hours.";
    return;
  }

  if (findRecord(studentId, date)) {
    clockInError.textContent = "This student already has a record for this date.";
    return;
  }

  attendanceList.push({
    id: createAttendanceId(),
    studentId,
    date,
    clockIn: time,
    clockOut: "",
    scheduledCloseTime: settings.closeTime, // FIX: remember closing time at clock-in
    autoClosed: false,
  });

  saveAttendance();
  clockInError.textContent = "";
  clockInDialog.close();
  renderAttendance();
});

// ---- clock-out dialog ----
function openClockOutDialog(student, record) {
  studentBeingClockedOut = student.studentId;
  clockOutInfo.textContent = `${student.fullNames} clocked in at ${record.clockIn}.`;
  clockOutTime.value = nowTime();
  clockOutError.textContent = "";
  clockOutDialog.showModal();
}

clockOutDialog
  .querySelector("[data-close]")
  .addEventListener("click", () => clockOutDialog.close());

clockOutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = attendanceDate.value;
  const record = findRecord(studentBeingClockedOut, date);

  if (!record) {
    clockOutError.textContent = "No open record found for this student.";
    return;
  }

  const time = clockOutTime.value;
  if (!time) {
    clockOutError.textContent = "Please enter a clock-out time.";
    return;
  }

  if (toMinutes(time) <= toMinutes(record.clockIn)) {
    clockOutError.textContent = "Clock-out must be later than clock-in.";
    return;
  }

  const scheduledClose = record.scheduledCloseTime || settings.closeTime;
  if (toMinutes(time) > toMinutes(scheduledClose)) {
    clockOutError.textContent = `Clock-out cannot be later than ${scheduledClose}.`;
    return;
  }

  record.clockOut = time;
  record.autoClosed = false;

  saveAttendance();
  studentBeingClockedOut = null;
  clockOutDialog.close();
  renderAttendance();
});

// ---- settings dialog ----
settingsBtn.addEventListener("click", function () {
  settingsForm
    .querySelectorAll('input[type="checkbox"]')
    .forEach((box) => {
      box.checked = settings.workingDays.includes(Number(box.value));
    });
  openTimeInput.value = settings.openTime;
  closeTimeInput.value = settings.closeTime;
  settingsError.textContent = "";
  settingsDialog.showModal();
});

settingsForm
  .querySelector("[data-close]")
  .addEventListener("click", () => settingsDialog.close());

settingsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const checkedDays = [
    ...settingsForm.querySelectorAll('input[type="checkbox"]:checked'),
  ].map((box) => Number(box.value));

  if (checkedDays.length === 0) {
    settingsError.textContent = "At least one working day must stay selected.";
    return;
  }

  if (openTimeInput.value >= closeTimeInput.value) {
    settingsError.textContent = "Opening time must be earlier than closing time.";
    return;
  }

  settings = {
    workingDays: checkedDays,
    openTime: openTimeInput.value,
    closeTime: closeTimeInput.value,
  };

  saveSettings();
  settingsError.textContent = "";
  settingsDialog.close();
  renderAttendance();
});

// ---- startup ----
loadSettings();
loadAttendance();
reconcileOpenRecords(); // FIX: auto-close overdue records on app open
attendanceDate.value = today(); // FIX: today() now works (String/padStart fixed)
attendanceDate.addEventListener("change", renderAttendance);
attendanceSearch.addEventListener("input", renderAttendance);
renderAttendance();
