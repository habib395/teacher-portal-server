import { Response } from "express";
import Assignment from "../models/Assignment";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all assignments
export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments", error });
  }
};

// CREATE an assignment (Teacher only)
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, deadline } = req.body;

    const newAssignment = await Assignment.create({
      title,
      subject,
      deadline,
      submittedBy: [],
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error });
  }
};

// SUBMIT an assignment (Student only)
export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // assignment id
    const userId = req.user?.id;

    // User এর studentProfile খুঁজে বের করুন (এটাই আসল Student _id)
    const user = await User.findById(userId);
    if (!user || !user.studentProfile) {
      return res.status(400).json({ message: "Student profile not found for this user" });
    }

    const studentId = user.studentProfile;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const alreadySubmitted = assignment.submittedBy.some(
      (sId) => sId.toString() === studentId.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "Already submitted" });
    }

    assignment.submittedBy.push(studentId);
    await assignment.save();

    res.status(200).json({ message: "Assignment submitted successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit assignment", error });
  }
};