import { Router } from "express";
import {
  getAssignments,
  createAssignment,
  submitAssignment,
} from "../controllers/assignmentController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getAssignments);
router.post("/", protect, authorizeRoles("teacher"), createAssignment);
router.put("/:id/submit", protect, authorizeRoles("student"), submitAssignment);

export default router;