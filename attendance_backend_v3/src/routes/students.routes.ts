import { Router } from "express";
import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../controllers/students.controllers.js";

export const studentsRouter = Router();

studentsRouter.get("/", getStudents);
studentsRouter.get("/:id", getStudentById);
studentsRouter.post("/", createStudent);
studentsRouter.put("/:id", updateStudent);
studentsRouter.delete("/:id", deleteStudent);