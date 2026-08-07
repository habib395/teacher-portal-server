import { Router } from "express";
import {
  getStudyMaterials,
  createStudyMaterial,
} from "../controllers/studyMaterialController";
// import verifyToken from "../middleware/verifyToken"; // আপনার মিডলওয়্যার পাথ অনুযায়ী আনকমেন্ট করুন

const router = Router();

router.get("/", getStudyMaterials);
router.post("/", createStudyMaterial);

export default router;