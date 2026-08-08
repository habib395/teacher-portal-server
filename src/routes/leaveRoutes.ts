import { Router } from "express";
import { getLeaves, createLeave, updateLeaveStatus } from "../controllers/leaveController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", protect, getLeaves);
router.post("/", protect, authorizeRoles("student"), upload.single("file"), createLeave);
router.put("/:id/status", protect, authorizeRoles("teacher"), updateLeaveStatus);

export default router;