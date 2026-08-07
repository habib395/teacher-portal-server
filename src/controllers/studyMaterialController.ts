import { Request, Response } from "express";
import { StudyMaterial } from "../models/stydyMaterials";

// Get all study materials
export const getStudyMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch study materials", error: error.message });
  }
};

// Create study material
export const createStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const newMaterial = new StudyMaterial(req.body);
    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create study material", error: error.message });
  }
};