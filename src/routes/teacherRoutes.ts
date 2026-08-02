import { Router } from "express";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getTeachers);
router.post("/", protect, authorizeRoles("admin"), createTeacher);
router.put("/:id", protect, authorizeRoles("admin"), updateTeacher);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeacher);

export default router;