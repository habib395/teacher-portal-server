import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// যদি পরবর্তীতে কন্ট্রোলারে ফাংশন বানান তবেই এগুলো আনকমেন্ট করবেন:
// router.put("/profile", protect, updateProfile);
// router.put("/change-password", protect, changePassword);

export default router;