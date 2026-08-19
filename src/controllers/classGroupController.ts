import { Response } from "express";
import ClassGroup from "../models/ClassGroup";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all class groups
export const getClassGroups = async (req: AuthRequest, res: Response) => {
  try {
    const classGroups = await ClassGroup.find().sort({ programName: 1, yearName: 1 });
    res.status(200).json(classGroups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch class groups", error });
  }
};

// CREATE a class group (Admin only)
export const createClassGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { programName, yearName } = req.body;

    const existing = await ClassGroup.findOne({ programName, yearName });
    if (existing) {
      return res.status(400).json({ message: "This class group already exists" });
    }

    const newClassGroup = await ClassGroup.create({ programName, yearName });
    res.status(201).json(newClassGroup);
  } catch (error) {
    res.status(500).json({ message: "Failed to create class group", error });
  }
};

// DELETE a class group (Admin only)
export const deleteClassGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ClassGroup.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Class group not found" });
    }

    res.status(200).json({ message: "Class group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete class group", error });
  }
};