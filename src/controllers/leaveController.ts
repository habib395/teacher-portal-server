import { Response } from "express";
import Leave from "../models/Leave";
import User from "../models/User";
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all leave applications (Teacher/Admin sees all)
export const getLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave applications", error });
  }
};

// CREATE a leave application (Student only)
export const createLeave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { reason, fromDate, toDate } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.studentProfile) {
      return res.status(400).json({ message: "Student profile not found for this user" });
    }

    let attachmentUrl: string | undefined;

    if (req.file) {
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "leave-attachments" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        stream.end(req.file!.buffer);
      });
      attachmentUrl = uploadResult.secure_url;
    }

    const newLeave = await Leave.create({
      studentId: user.studentProfile,
      studentName: user.name,
      reason,
      fromDate,
      toDate,
      attachmentUrl,
      status: "pending",
    });

    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit leave application", error });
  }
};

// UPDATE leave status (Teacher only — approve/reject)
export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave status", error });
  }
};