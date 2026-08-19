import { Response } from "express";
import { StudyMaterial } from "../models/stydyMaterials";
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/authMiddleware";

// Get all study materials
export const getStudyMaterials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch study materials", error: error.message });
  }
};

// Create (upload) study material
export const createStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, subject, category } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const uploadResult = await new Promise<{ secure_url: string; bytes: number }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "study-materials" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string; bytes: number });
          }
        );
        stream.end(req.file!.buffer);
      }
    );

    const sizeInMB = (uploadResult.bytes / (1024 * 1024)).toFixed(2);
    const fileSize = `${sizeInMB} MB`;

    const newMaterial = new StudyMaterial({
      title,
      subject,
      category,
      fileSize,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadUrl: uploadResult.secure_url,
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create study material", error: error.message });
  }
};

// Delete study material
export const deleteStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await StudyMaterial.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Study material not found" });
      return;
    }

    res.status(200).json({ message: "Study material deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete study material", error: error.message });
  }
};