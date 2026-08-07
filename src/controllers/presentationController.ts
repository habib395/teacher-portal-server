import { Response } from "express";
import Presentation from "../models/Presentation";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all presentations
export const getPresentations = async (req: AuthRequest, res: Response) => {
  try {
    const presentations = await Presentation.find().sort({ date: 1, time: 1 });
    res.status(200).json(presentations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch presentations", error });
  }
};

// CREATE a presentation (Teacher assigns to a student)
export const createPresentation = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, studentName, topic, subject, date, time } = req.body;

    const newPresentation = await Presentation.create({
      studentId,
      studentName,
      topic,
      subject,
      date,
      time,
    });

    res.status(201).json(newPresentation);
  } catch (error) {
    res.status(500).json({ message: "Failed to create presentation", error });
  }
};

// DELETE a presentation
export const deletePresentation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Presentation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Presentation not found" });
    }
    res.status(200).json({ message: "Presentation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete presentation", error });
  }
};