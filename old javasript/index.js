// 
const studentForm = document.querySelector("#student-form");
const studentName = document.querySelector("#student-name");
const studentTrack = document.querySelector("#student-track");
const studentStatus = document.querySelector("#student-status");
const addstudentDialog = document.querySelector("#dialog-student");
const addStudentBtn = document.querySelector("#open-dialog");
const closeDialog = document.querySelector("#cancel-dialog");
const studentFormHeader = document.querySelector("#h2");
const p = document.querySelector(".error-message");
const studentBody = document.querySelector("#student-body");
const studentSearch = document.querySelector("#student_search");
const deleteDialog = document.querySelector("#delete-dialog");
const deleteForm = document.querySelector("#delete-form");
const deleteMessage = document.querySelector("#delete-message");
const closeDeleteDialog = document.querySelector("#close-delete-button");
const studentIdInput = document.querySelector("#student-id");
const studentFormError = document.querySelector("#student-form-error");

let studentList = [];
const KEY = "all_students";
console.log(studentList)

//JSON.stringnify turns our array into one long string

function saveStudents() {
  localStorage.setItem(KEY, JSON.stringify(studentList));
}

function loadStudents() {
  if (!localStorage.getItem(KEY)) {
    return;
  }

  //JSON.parse turns that string back into a real array.
  try {
    studentList = JSON.parse(localStorage.getItem(KEY));
  } catch (error) {
    console.log("Error fetching data.", error);
    studentList = [];
  }
}

function studentDetails(studentId) {
  const student = studentList.find(
    (student) => student.studentId === studentId
  );

  if (student) {
    return student;
  } else {
    console.log("Student does not exist!");
  }
}

function editStudent(studentId, studentUpdate) {
  studentList = studentList.map((student) =>
    student.studentId === studentId ? { ...student, ...studentUpdate } : student
  );
}

function generateStudentId() {
  return `${Date.now()}${Math.random()}`;
}

studentForm.addEventListener("submit", addStudent);

function addStudent(e) {
  e.preventDefault();
  const fullStudentName = studentName.value.trim();

  if (fullStudentName === "") {
    p.textContent = "Warning: Please enter values for all fields!";
    studentName.focus();
  } else {
    const studentData = {
      fullNames: fullStudentName,
      track: studentTrack.value,
      status: studentStatus.value,
    };

    if (studentIdInput.value) {
      editStudent(studentIdInput.value, studentData);
    } else {
      const student = {
        studentId: generateStudentId(),
        ...studentData,
      };

      studentList.push(student);
    }

    p.textContent = "";
    studentForm.reset();
    addstudentDialog.close();
  }

  saveStudents();

  renderStudents();
}

// open and close dialog, reset the form

addStudentBtn.addEventListener("click", function () {
  studentForm.reset();
  studentFormHeader.textContent = "Add Student";
  addstudentDialog.showModal();
});

closeDialog.addEventListener("click", function () {
  addstudentDialog.close();
});

// add one text cell to a row
function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.append(cell);
}

// creating action buttons (edit, delete)

function makeActionButton(label, student) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "table-action";
  button.textContent = label;

  button.addEventListener("click", function () {
    if (label === "Edit") {
      showEditDialog(student.studentId);
    } else {
      showDeleteDialog(student.studentId);
    }
  });

  return button;
}

//keep only the students whose name matches what the user searched
//empty search box = kep everybody
function searchStudents() {
  const searchText = studentSearch.value.trim().toLowerCase();

  return studentList.filter((student) =>
    student.fullNames.toLowerCase().includes(searchText)
  );
}

//empty table then add one row per student we want to show
function renderStudents() {
  studentBody.replaceChildren();

  searchStudents().forEach((student, index) => {
    const studentRow = document.createElement("tr");

    //putting numbers and adding a maximum length to the string of numbers
    addCell(studentRow, String(index + 1).padStart(3, "0"));

    addCell(studentRow, student.fullNames);
    addCell(studentRow, student.track);
    // addCell(row, student.status);

    //styling the status
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

    //actions column: edit and delete
    const actionsCell = document.createElement("td");
    actionsCell.append(
      makeActionButton("Edit", student),
      makeActionButton("Delete", student)
    );

    studentRow.append(actionsCell);
    studentBody.append(studentRow);
  });
}

// //edit a student information from the list

function showEditDialog(studentId) {
  const student = studentDetails(studentId);
  if (!student) {
    return;
  }
  //put the student we clicked into the form
  studentIdInput.value = student.studentId;
  studentName.value = student.fullNames;
  studentTrack.value = student.track;
  p.textContent = "";
  studentFormHeader.textContent = "Edit";

  addstudentDialog.showModal();
}

//delete a student from the list
let studentToDelete = null;
function deleteStudent(studentId) {
  studentList = studentList.filter(
    (student) => student.studentId !== studentId
  );
}

function showDeleteDialog(studentId) {
  const student = studentDetails(studentId);

  if (!student) {
    return;
  }

  studentToDelete = student.studentId;

  deleteMessage.textContent = `Are you sure you want to delete ${student.fullNames}? This action can't be undone.`;

  deleteDialog.showModal();
}

deleteForm.addEventListener("submit", confirmDelete);

function confirmDelete(e) {
  e.preventDefault();

  deleteStudent(studentToDelete);
  studentToDelete = null;

  saveStudents();

  renderStudents();

  deleteDialog.close();
}

closeDeleteDialog.addEventListener("click", () => {
  deleteDialog.close();
});

// closeDeleteDialog();

loadStudents();
studentSearch.addEventListener("input", renderStudents);
renderStudents();