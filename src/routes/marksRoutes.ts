import { Router } from "express";
import { 
  getMarksByStudent, 
  getMarksBySubjectAndClass, 
  saveMarks 
} from "../controllers/marksController";
import { protect, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// স্টুডেন্টের আইডি অনুযায়ী মার্কস আনার রুট
router.get("/", protect, getMarksByStudent);

// সাবজেক্ট ও ক্লাস অনুযায়ী পাওয়ার রুট
router.get("/by-subject", protect, getMarksBySubjectAndClass);

// মার্কস সেভ করার রুট
router.post("/", protect, authorizeRoles("teacher"), saveMarks);

export default router;