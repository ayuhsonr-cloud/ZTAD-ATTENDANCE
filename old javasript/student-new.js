const studentDialog = document.querySelector('#student-dialog')
const studentForm = document.querySelector('#student-form')
const studentIdInput = document.querySelector("#student-id")
const studentName = document.querySelector("#student-name")
const studentTrack = document.querySelector("#student-track")
const studentStatus = document.querySelector("#student-status")
const studentFormHeading = document.querySelector("#student-dialog-heading")
const studentFormError = document.querySelector("#student-form-error")

const deleteDialog = document.querySelector('#delete-dialog')
const closeDeleteDialog = document.querySelector('#close-delete-button')
const deleteForm = document.querySelector('#delete-form')
const deleteMessage = document.querySelector('#delete-message')

const studentSearch = document.querySelector("#student-search")
const tableBody = document.querySelector("#table-body")
const addStudentBtn = document.querySelector("#add-student-button")
const emptyStateAddBtn = document.querySelector("[data-add-student]")

// initial list of students 
let studentList = [];



// local storage 
const KEY = "all_students";

// JSON.stringify turns our array into string.
function saveStudents() {
    localStorage.setItem(KEY, JSON.stringify(studentList));
}

// fetch the students from local storage when the page loads.
function loadStudents() {
    // const savedStudents = localStorage.getItem(KEY);

    if (!localStorage.getItem(KEY)) {
        return;
    }

    // JSON.parse turns that string back into a real array.
    try {
        studentList = JSON.parse(localStorage.getItem(KEY));
    } catch (error) {
        console.log("Error fetching data.", error);
        studentList = [];
    }

    // If it is anything else, show empty state.
    // if (!Array.isArray(studentList)) {
    //     studentList = [];
    // }
}

// Create unique StudentID for each student
function createStudentId() {
    return `${Date.now()}${Math.random()}`;
}

// student details
function studentDetails(studentId) {
    const student = studentList.find(
        (student) => student.studentId === studentId,
    );

    if (student) {
        return student;
    } else {
        console.log("student does not exist");
    }
}

// delete student from list
function deleteStudent(studentId) {
    studentList = studentList.filter(
        (student) => student.studentId !== studentId,
    );
}

// The attendance records live on the other page, under their own key.
// When a student goes, their attendance has to go with them, or we keep
// rows pointing at a student who no longer exists.
function deleteStudentAttendance(studentId) {
    if (!localStorage.getItem("all_attendance")) {
        return;
    }

    try {
        const attendanceList = JSON.parse(localStorage.getItem("all_attendance"));

        // Same filter as above, only this time we match on studentId
        const keptRecords = attendanceList.filter(
            (record) => record.studentId !== studentId,
        );

        localStorage.setItem("all_attendance", JSON.stringify(keptRecords));
    } catch (error) {
        console.log("Could not read attendance.", error);
    }
}

// edit student from the list
function editStudent(studentId, studentUpdate) {
    studentList = studentList.map((student) =>
        student.studentId === studentId
            ? { ...student, ...studentUpdate }
            : student,
    );
}




// Add student form
addStudentBtn.addEventListener('click', showDialog)
emptyStateAddBtn.addEventListener('click', showDialog)

function showDialog() {
    // Empty form = we are adding, not editing
    studentForm.reset()
    studentIdInput.value = ""
    studentFormError.textContent = ""
    studentFormHeading.textContent = "Add student"

    studentDialog.showModal()
}


// Add new student 
studentForm.addEventListener('submit', addStudent)

function addStudent(e) {
    e.preventDefault()

    const fullNames = studentName.value.trim()

    if (fullNames === "") {
        studentFormError.textContent = "Please enter the student's name."
        studentTrack.focus()
        return
    }

    // read what was typed in the form
    const formData = {
        fullNames: fullNames,
        track: studentTrack.value,
        status: studentStatus.value,
    };

    if (studentIdInput.value) {
        // the hidden id is filled, so we are editing an existing student
        editStudent(studentIdInput.value, formData)
    } else {
        // no id yet, so this is a brand new student
        const student = {
            studentId: createStudentId(),
            ...formData,
        };

        studentList.push(student);
    }

    console.log(studentList)

    // save to local storage 
    saveStudents()

    // display students on the table
    renderStudents()

    studentDialog.close()
}


// Add one text cell to a row
function addCell(row, text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.append(cell);
}

// Make an "Edit" or "Delete" button
function makeActionButton(text, student) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-action";
    button.textContent = text;

    button.addEventListener("click", function () {
        if (text === "Edit") {
            showEditDialog(student.studentId);
        } else {
            showDeleteDialog(student.studentId);
        }
    });

    return button;
}

// Keep only the students whose name matches what was typed in the search box.
// Empty search box = keep everybody.
function searchStudents() {
    const searchText = studentSearch.value.trim().toLowerCase();

    return studentList.filter((student) =>
        student.fullNames.toLowerCase().includes(searchText),
    );
}

console.log(studentList)

// Empty the table, then add one row per student we want to show
function renderStudents() {
    tableBody.replaceChildren();

    searchStudents().forEach((student, index) => {

        const studentRow = document.createElement("tr");

        addCell(studentRow, String(index + 1).padStart(3, "0"));

        addCell(studentRow, student.fullNames);

        addCell(studentRow, student.track);

        // Status goes in a pill so it gets the rounded style
        const statusCell = document.createElement("td");
        const statusPill = document.createElement("span");

        if (student.status == "active") {
            statusPill.className = "status-pill status-green";
        } else {
            statusPill.className = "status-pill status-red";
        }

        statusPill.textContent = student.status;
        statusCell.append(statusPill);

        studentRow.append(statusCell);

        // Actions column: Edit + Delete
        const actionsCell = document.createElement("td");

        actionsCell.append(
            makeActionButton("Edit", student),
            makeActionButton("Delete", student),
        );

        studentRow.append(actionsCell);

        tableBody.append(studentRow);
    });
}



// Edit student
function showEditDialog(studentId) {
    const student = studentDetails(studentId)

    if (!student) {
        return
    }

    // Put the student we clicked into the form
    studentIdInput.value = student.studentId
    studentName.value = student.fullNames
    studentTrack.value = student.track
    studentStatus.value = student.status
    studentFormError.textContent = ""
    studentFormHeading.textContent = "Edit student"

    studentDialog.showModal()
}


// Delete student
let studentToDelete = null;

function showDeleteDialog(studentId) {
    
    const student = studentDetails(studentId)

    if (!student) {
        return
    }

    // Remember who we are about to delete, then ask for confirmation
    studentToDelete = student.studentId

    deleteMessage.textContent = `Are you sure you want to delete ${student.fullNames}? Their attendance records go too.`

    deleteDialog.showModal()
}

closeDeleteDialog.addEventListener('click', () => {
    deleteDialog.close()
})

deleteForm.addEventListener('submit', confirmDelete)

function confirmDelete(e) {
    e.preventDefault()

    deleteStudent(studentToDelete)
    deleteStudentAttendance(studentToDelete)

    studentToDelete = null
    saveStudents()
    renderStudents()
    deleteDialog.close()
}

// Read the saved students first, then show them in the table
loadStudents()

// Redraw the table on every keystroke in the search box
studentSearch.addEventListener('input', renderStudents)

renderStudents()

