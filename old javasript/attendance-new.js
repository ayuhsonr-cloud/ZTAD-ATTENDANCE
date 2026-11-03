// Attendance page (index.html)
// Shared things like the mobile menu and the Cancel buttons already work,
// they live in index.js. This file is only about the attendance register.
//
// Every pattern here is the same one you used in student.js:
// save + load, find + edit + delete, draw the table, open a dialog,
// check the form, then save + redraw + close.

const attendanceDate = document.querySelector("#attendance-date") // Date picker in the toolbar
const attendanceSearch = document.querySelector("#attendance-search") // Search by name or track
const attendanceBody = document.querySelector("#attendance-body") // Table body we draw rows into
const attendanceNotice = document.querySelector("#attendance-notice") // Message above the table

const clockInBtn = document.querySelector("#toolbar-clock-in")
const clockInDialog = document.querySelector("#clock-in-dialog")
const clockInForm = document.querySelector("#clock-in-form")
const clockInStudent = document.querySelector("#clock-in-student") // Which student to clock in
const clockInTime = document.querySelector("#clock-in-time")
const clockInError = document.querySelector("#clock-in-error")

const clockOutDialog = document.querySelector("#clock-out-dialog")
const clockOutForm = document.querySelector("#clock-out-form")
const clockOutSummary = document.querySelector("#clock-out-summary")
const clockOutTime = document.querySelector("#clock-out-time")
const clockOutError = document.querySelector("#clock-out-error")

// The correction dialog is the "Edit" form for one attendance record
const correctionDialog = document.querySelector("#correction-dialog")
const correctionForm = document.querySelector("#correction-form")
const correctionHeading = document.querySelector("#correction-heading")
const correctionSummary = document.querySelector("#correction-summary")
const correctionClockIn = document.querySelector("#correction-clock-in")
const correctionClockOut = document.querySelector("#correction-clock-out")
const correctionError = document.querySelector("#correction-error")
const removeAttendanceBtn = document.querySelector("#remove-attendance-button")

const removeDialog = document.querySelector("#remove-dialog")
const removeForm = document.querySelector("#remove-form")
const removeMessage = document.querySelector("#remove-message")

const settingsBtn = document.querySelector("#settings-button")
const settingsDialog = document.querySelector("#settings-dialog")
const settingsForm = document.querySelector("#settings-form")
const settingsOpeningTime = document.querySelector("#settings-opening-time")
const settingsClosingTime = document.querySelector("#settings-closing-time")
const settingsError = document.querySelector("#settings-error")
const workingDayInputs = document.querySelectorAll("input[name='working-day']")

// Attendance List 
let attendanceList = [];

// 0 = Monday ... 6 = Sunday
let settings = {
    workingDays: [0, 1, 2, 3, 4],
    openingTime: "09:00",
    closingTime: "17:00",
};

// local storage
const ATTENDANCE_KEY = "all_attendance";
const SETTINGS_KEY = "attendance_settings";

function saveAttendance() {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceList));
}

// fetch the attendance from local storage
function loadAttendance() {
    if (!localStorage.getItem(ATTENDANCE_KEY)) {
        return;
    }

    // JSON.parse turns that string back into a real array.
    try {
        attendanceList = JSON.parse(localStorage.getItem(ATTENDANCE_KEY));
    } catch (error) {
        console.log("Error fetching attendance.", error);
        attendanceList = [];
    }
}

// Same two functions again, for the settings.
function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
    if (!localStorage.getItem(SETTINGS_KEY)) {
        return;
    }

    try {
        settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    } catch (error) {
        console.log("Error fetching settings.", error);
    }
}

// This page only reads them, it never writes them.
function getStudents() {
    if (!localStorage.getItem("all_students")) {
        return [];
    }

    try {
        return JSON.parse(localStorage.getItem("all_students"));
    } catch (error) {
        console.log("Could not read students.", error);
        return [];
    }
}

// Only active students come to work, so only they get a row.
function activeStudents() {
    return getStudents().filter((student) => student.status === "active");
}

// Create unique AttendanceID for each record
function createAttendanceId() {
    return `${Date.now()}-${Math.random()}`;
}

// attendance details
function attendanceDetails(attendanceId) {
    const record = attendanceList.find(
        (record) => record.attendanceId === attendanceId,
    );

    if (record) {
        return record;
    } else {
        console.log("attendance record does not exist");
    }
}

// The record for one student on one day.
// Both conditions matter: the right student AND the right day.
function findRecord(studentId, date) {
    return attendanceList.find(
        (record) => record.studentId === studentId && record.date === date,
    );
}

// remove a record from the list
function deleteAttendance(attendanceId) {
    attendanceList = attendanceList.filter(
        (record) => record.attendanceId !== attendanceId,
    );
}

// edit a record in the list
function editAttendance(attendanceId, attendanceUpdate) {
    attendanceList = attendanceList.map((record) =>
        record.attendanceId === attendanceId
            ? { ...record, ...attendanceUpdate }
            : record,
    );
}


// Dates and times
function today() {
    const now = new Date()

    const year = now.getFullYear()
    // getMonth() counts from zero, so August is 7. That is why we add 1.
    const month = String(now.getMonth() + 1).padStart(2, "0")

    const day = String(now.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function timeNow() {
    const now = new Date()

    const hours = String(now.getHours()).padStart(2, "0")

    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
}

const DAY_NAMES = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

// getDay() gives 0 for Sunday, but our checkboxes start on Monday,
// so we shift the number along by six and wrap it round with %.
function weekdayNumber(date) {
    const day = new Date(`${date}T00:00`).getDay()

    return (day + 6) % 7
}

function dayName(date) {
    return DAY_NAMES[weekdayNumber(date)]
}

function isWorkingDay(date) {
    return settings.workingDays.includes(weekdayNumber(date))
}

// "08:15" becomes 495, the number of minutes since midnight
function timeToMinutes(time) {
    const parts = time.split(":")

    return Number(parts[0]) * 60 + Number(parts[1])
}

// 510 becomes "8h 30m"
function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
}

// Clock out minus clock in. No clock out yet means no total.
function dailyTotal(record) {
    if (!record || !record.clockOut) {
        return "—"
    }

    return formatMinutes(
        timeToMinutes(record.clockOut) - timeToMinutes(record.clockIn),
    )
}

// Every time rule, so all forms check the same things.
function checkTimes(date, clockIn, clockOut) {
    if (!date) {
        return "Please pick a date first."
    }

    if (date > today()) {
        return "You cannot record attendance for a future date."
    }

    if (date < today()) {
        return "You cannot record attendance for a pass date."
    }

    if (!isWorkingDay(date)) {
        return `${dayName(date)} is not a working day.`
    }

    if (!clockIn) {
        return "Please enter a clock-in time."
    }

    if (clockIn < settings.openingTime || clockIn > settings.closingTime) {
        return `Clock-in must be between ${settings.openingTime} and ${settings.closingTime}.`
    }

    // The clock out is allowed to be empty: that student is still in.
    if (clockOut) {
        if (clockOut > settings.closingTime) {
            return `Clock-out cannot be later than ${settings.closingTime}.`
        }

        if (clockOut <= clockIn) {
            return "Clock-out must be later than the clock-in time."
        }
    }

    return ""
}


// Add one text cell to a row
function addCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.append(cell);
}

// Make a "Clock in", "Clock out" or "Edit" button
function makeActionButton(text, student, record) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-action";
    button.textContent = text;

    button.addEventListener("click", function () {
        if (text === "Clock in") {
            showClockInDialog(student.studentId);
        } else if (text === "Clock out") {
            showClockOutDialog(record.attendanceId);
        } else {
            showEditDialog(record.attendanceId);
        }
    });

    return button;
}

// No record yet, still in, or done for the day
function attendanceStatus(record) {
    if (!record) {
        return "Not clocked in"
    }

    if (!record.clockOut) {
        return "Currently in"
    }

    return "Completed"
}

// Keep only the students whose name or track matches the search box.
// Empty search box = keep everybody.
function searchStudents() {
    const searchText = attendanceSearch.value.trim().toLowerCase();

    return activeStudents().filter((student) =>
        `${student.fullNames} ${student.track}`
            .toLowerCase()
            .includes(searchText),
    );
}

// A short summary above the table
function showNotice() {
    const date = attendanceDate.value

    if (!date) {
        attendanceNotice.textContent = "Pick a date to see the register."
        return
    }

    if (!isWorkingDay(date)) {
        attendanceNotice.textContent = `${dayName(date)} is not a working day, so nobody can be clocked in.`
        return
    }

    const dayRecords = attendanceList.filter((record) => record.date === date)
    const stillIn = dayRecords.filter((record) => !record.clockOut)

    attendanceNotice.textContent = `${dayRecords.length} clocked in on ${date}, ${stillIn.length} still in.`
}

// Empty the table, then add one row per student we want to show.
// The rows come from the students; the record is the optional part.
function renderAttendance() {
    attendanceBody.replaceChildren();

    const date = attendanceDate.value;

    searchStudents().forEach((student, index) => {

        const attendanceRow = document.createElement("tr");
        const record = findRecord(student.studentId, date);

        addCell(attendanceRow, String(index + 1).padStart(3, "0"));

        addCell(attendanceRow, student.fullNames);

        addCell(attendanceRow, student.track);

        // Status goes in a pill so it gets the rounded style
        const statusCell = document.createElement("td");
        const statusPill = document.createElement("span");
        const status = attendanceStatus(record);

        if (status === "Currently in") {
            statusPill.className = "status-pill status-green";
        } else if (status === "Not clocked in") {
            statusPill.className = "status-pill status-red";
        } else {
            statusPill.className = "status-pill";
        }

        statusPill.textContent = status;
        statusCell.append(statusPill);

        attendanceRow.append(statusCell);

        addCell(attendanceRow, record ? record.clockIn : "—");

        addCell(attendanceRow, record && record.clockOut ? record.clockOut : "—");

        addCell(attendanceRow, dailyTotal(record));

        // Actions column: what you can do depends on the record
        const actionsCell = document.createElement("td");

        if (!record) {
            actionsCell.append(makeActionButton("Clock in", student, record));
        } else if (!record.clockOut) {
            actionsCell.append(
                makeActionButton("Clock out", student, record),
                makeActionButton("Edit", student, record),
            );
        } else {
            actionsCell.append(makeActionButton("Edit", student, record));
        }

        attendanceRow.append(actionsCell);

        attendanceBody.append(attendanceRow);
    });

    showNotice();
}




// Clock in
clockInBtn.addEventListener('click', () => showClockInDialog(""))

function showClockInDialog(studentId) {
    clockInForm.reset()
    clockInError.textContent = ""

    // Fill the dropdown every time we open, so a student added a minute ago
    // is already in the list. replaceChildren() clears the old options first,
    // otherwise the list doubles on every open.
    clockInStudent.replaceChildren()

    // A first empty option, so the box is not silently pointing at someone
    const placeholder = document.createElement("option")
    placeholder.value = ""
    placeholder.textContent = "Select a student"
    clockInStudent.append(placeholder)

    activeStudents().forEach((student) => {
        const option = document.createElement("option")

        // The user reads the name, our code reads the id
        option.value = student.studentId
        option.textContent = student.fullNames

        clockInStudent.append(option)
    })

    // Empty string = the toolbar button, so nobody is pre-selected
    clockInStudent.value = studentId
    clockInTime.value = timeNow()

    clockInDialog.showModal()
}

clockInForm.addEventListener('submit', clockInStudentRecord)

function clockInStudentRecord(e) {
    e.preventDefault()

    const studentId = clockInStudent.value
    const date = attendanceDate.value

    // Check, refuse with a message, then act
    if (studentId === "") {
        clockInError.textContent = "Please choose a student."
        return
    }

    if (findRecord(studentId, date)) {
        clockInError.textContent = "That student is already clocked in on this date."
        return
    }

    const problem = checkTimes(date, clockInTime.value, "")

    if (problem) {
        clockInError.textContent = problem
        return
    }

    attendanceList.push({
        attendanceId: createAttendanceId(),
        studentId: studentId,
        date: date,
        clockIn: clockInTime.value,
        clockOut: "",
    })

    // Save, redraw, close
    saveAttendance()
    renderAttendance()
    clockInDialog.close()
}




// Clock out
// Remember which record we are working on, the same way student.js
// remembers studentToDelete.
let recordToClockOut = null

function showClockOutDialog(attendanceId) {
    const record = attendanceDetails(attendanceId)

    if (!record) {
        return
    }

    recordToClockOut = record.attendanceId

    const student = getStudents().find(
        (student) => student.studentId === record.studentId,
    )

    clockOutSummary.textContent = `${student.fullNames} clocked in at ${record.clockIn}.`
    clockOutTime.value = timeNow()
    clockOutError.textContent = ""

    clockOutDialog.showModal()
}

clockOutForm.addEventListener('submit', confirmClockOut)

function confirmClockOut(e) {
    e.preventDefault()

    const record = attendanceDetails(recordToClockOut)
    const problem = checkTimes(record.date, record.clockIn, clockOutTime.value)

    if (problem) {
        clockOutError.textContent = problem
        return
    }

    editAttendance(recordToClockOut, { clockOut: clockOutTime.value })

    recordToClockOut = null
    saveAttendance()
    renderAttendance()
    clockOutDialog.close()
}




// Edit a record
let recordToEdit = null

function showEditDialog(attendanceId) {
    const record = attendanceDetails(attendanceId)

    if (!record) {
        return
    }

    recordToEdit = record.attendanceId

    const student = getStudents().find(
        (student) => student.studentId === record.studentId,
    )

    // Put the record we clicked into the form
    correctionHeading.textContent = "Correct attendance"
    correctionSummary.textContent = `${student.fullNames} · ${record.date}`
    correctionClockIn.value = record.clockIn
    correctionClockOut.value = record.clockOut
    correctionError.textContent = ""

    // Removing only makes sense once a record exists
    removeAttendanceBtn.hidden = false

    correctionDialog.showModal()
}

correctionForm.addEventListener('submit', confirmEdit)

function confirmEdit(e) {
    e.preventDefault()

    const record = attendanceDetails(recordToEdit)
    const problem = checkTimes(
        record.date,
        correctionClockIn.value,
        correctionClockOut.value,
    )

    if (problem) {
        correctionError.textContent = problem
        return
    }

    editAttendance(recordToEdit, {
        clockIn: correctionClockIn.value,
        // An empty clock out means the student is still in
        clockOut: correctionClockOut.value,
    })

    recordToEdit = null
    saveAttendance()
    renderAttendance()
    correctionDialog.close()
}




// Remove a record
removeAttendanceBtn.addEventListener('click', showRemoveDialog)

function showRemoveDialog() {
    const record = attendanceDetails(recordToEdit)

    if (!record) {
        return
    }

    removeMessage.textContent = `Are you sure you want to remove the ${record.date} record?`

    removeDialog.showModal()
}

removeForm.addEventListener('submit', confirmRemove)

function confirmRemove(e) {
    e.preventDefault()

    deleteAttendance(recordToEdit)

    recordToEdit = null
    saveAttendance()
    renderAttendance()

    // Close the confirmation first, then the form behind it
    removeDialog.close()
    correctionDialog.close()
}




// Settings
settingsBtn.addEventListener('click', showSettingsDialog)

function showSettingsDialog() {
    // Tick the days that are already working days
    workingDayInputs.forEach((input) => {
        input.checked = settings.workingDays.includes(Number(input.value))
    })

    settingsOpeningTime.value = settings.openingTime
    settingsClosingTime.value = settings.closingTime
    settingsError.textContent = ""

    settingsDialog.showModal()
}

settingsForm.addEventListener('submit', saveSettingsForm)

function saveSettingsForm(e) {
    e.preventDefault()

    // Collect the day numbers of the boxes that are ticked
    const workingDays = []

    workingDayInputs.forEach((input) => {
        if (input.checked) {
            workingDays.push(Number(input.value))
        }
    })

    if (workingDays.length === 0) {
        settingsError.textContent = "Please choose at least one working day."
        return
    }

    if (settingsClosingTime.value <= settingsOpeningTime.value) {
        settingsError.textContent = "Closing time must be later than opening time."
        return
    }

    settings = {
        workingDays: workingDays,
        openingTime: settingsOpeningTime.value,
        closingTime: settingsClosingTime.value,
    }

    saveSettings()
    renderAttendance()
    settingsDialog.close()
}




// Read the saved settings and attendance first, then show today's register
loadSettings()
loadAttendance()

attendanceDate.value = today()

// Redraw when the date changes and on every keystroke in the search box
attendanceDate.addEventListener('change', renderAttendance)
attendanceSearch.addEventListener('input', renderAttendance)

renderAttendance()
