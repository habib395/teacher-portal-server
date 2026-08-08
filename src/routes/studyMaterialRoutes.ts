import { Router } from "express";
import {
  getStudyMaterials,
  createStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/studyMaterialController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", protect, getStudyMaterials);
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  upload.single("file"),
  createStudyMaterial
);
router.delete("/:id", protect, authorizeRoles("teacher"), deleteStudyMaterial);

export default router;