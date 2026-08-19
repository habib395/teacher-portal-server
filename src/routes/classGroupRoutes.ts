import { Router } from "express";
import {
  getClassGroups,
  createClassGroup,
  deleteClassGroup,
} from "../controllers/classGroupController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getClassGroups);
router.post("/", protect, authorizeRoles("admin"), createClassGroup);
router.delete("/:id", protect, authorizeRoles("admin"), deleteClassGroup);

export default router;