import { Router } from "express";
import { getNotices, createNotice, deleteNotice } from "../controllers/noticeController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getNotices);
router.post("/", protect, authorizeRoles("admin"), createNotice);
router.delete("/:id", protect, authorizeRoles("admin"), deleteNotice);

export default router;