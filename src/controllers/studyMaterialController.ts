import { Response } from "express";
import { StudyMaterial } from "../models/stydyMaterials";
import User from "../models/User";
import Student from "../models/Student";
import Teacher from "../models/Teacher"; 
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/authMiddleware";

// Get study materials (Filtered by role and class)
export const getStudyMaterials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let query = {};

    if (user.role === "teacher") {
      const teacherUser: any = await User.findById(user.id).populate("teacherProfile");
      const teacherId = teacherUser?.teacherProfile?._id;

      if (teacherId) {
        query = { teacher: teacherId };
      } else {
        res.status(200).json([]);
        return;
      }
    } else if (user.role === "student") {
      const studentUser = await User.findById(user.id);
      const studentRecord = await Student.findById(studentUser?.studentProfile);
      
      if (!studentRecord || !studentRecord.classGroupId) {
        res.status(200).json([]);
        return;
      }

      query = { classGroupId: studentRecord.classGroupId };
    }

    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch study materials", error: error.message });
  }
};

// Create (upload) study material (Teacher selects class)
export const createStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, subject, category, classGroupId } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!classGroupId) {
      res.status(400).json({ message: "Class selection is required" });
      return;
    }

    const user = await User.findById(req.user?.id).populate("teacherProfile");
    const teacherId = (user?.teacherProfile as any)?._id;

    if (!teacherId && req.user?.role === "teacher") {
      res.status(403).json({ message: "Teacher profile not found for this user" });
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
      classGroupId,
      teacher: teacherId,
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