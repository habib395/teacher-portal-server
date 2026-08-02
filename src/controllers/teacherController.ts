import { Response } from "express";
import Teacher from "../models/Teacher";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all teachers
export const getTeachers = async (req: AuthRequest, res: Response) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers", error });
  }
};

// CREATE a teacher
export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, subject, phone } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    const newTeacher = await Teacher.create({ name, email, subject, phone });
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to create teacher", error });
  }
};

// UPDATE a teacher
export const updateTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, subject, phone } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, email, subject, phone },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error });
  }
};

// DELETE a teacher
export const deleteTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error });
  }
};