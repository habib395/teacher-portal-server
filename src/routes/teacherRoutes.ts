import { Router } from "express";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getMyTeacherProfile,
} from "../controllers/teacherController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", protect, getMyTeacherProfile); 
router.get("/", protect, getTeachers);
router.post("/", protect, authorizeRoles("admin"), createTeacher);
router.put("/:id", protect, authorizeRoles("admin"), updateTeacher);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeacher);

export default router;