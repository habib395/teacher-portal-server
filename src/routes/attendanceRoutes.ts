import { Router } from "express";
import { getAttendanceByDate, saveAttendance } from "../controllers/attendanceController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getAttendanceByDate);
router.post("/", protect, authorizeRoles("teacher"), saveAttendance);

export default router;