import { Router } from "express";
import { getMarksByStudent, saveMarks } from "../controllers/marksController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getMarksByStudent);
router.post("/", protect, authorizeRoles("teacher"), saveMarks);

export default router;