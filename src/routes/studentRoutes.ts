import { Router } from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getStudents);
router.post("/", protect, authorizeRoles("admin"), createStudent);
router.put("/:id", protect, authorizeRoles("admin"), updateStudent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);

export default router;