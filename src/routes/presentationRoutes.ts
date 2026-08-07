import { Router } from "express";
import {
  getPresentations,
  createPresentation,
  deletePresentation,
} from "../controllers/presentationController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getPresentations);
router.post("/", protect, authorizeRoles("teacher"), createPresentation);
router.delete("/:id", protect, authorizeRoles("teacher"), deletePresentation);

export default router;