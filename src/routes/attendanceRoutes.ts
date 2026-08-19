
import { Router } from "express";
import {
  getAttendanceByClassAndDate,
  saveAttendance,
  getAttendanceByStudent,
} from "../controllers/attendanceController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getAttendanceByClassAndDate);
router.get("/summary", protect, getAttendanceByStudent);
router.post("/", protect, authorizeRoles("teacher"), saveAttendance);

export default router;