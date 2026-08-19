import { Router } from "express";
import { 
  getMarksByStudent, 
  getMarksBySubjectAndClass, 
  saveMarks 
} from "../controllers/marksController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getMarksByStudent);

router.get("/by-subject", protect, getMarksBySubjectAndClass);

router.post("/", protect, authorizeRoles("teacher"), saveMarks);

export default router;