import { Response } from "express";
import Notice from "../models/Notice";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all notices
export const getNotices = async (req: AuthRequest, res: Response) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices", error });
  }
};

// CREATE a notice (Admin only)
export const createNotice = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;

    const newNotice = await Notice.create({
      title,
      message,
      postedBy: "Admin",
    });

    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: "Failed to create notice", error });
  }
};

// DELETE a notice (Admin only)
export const deleteNotice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice", error });
  }
};