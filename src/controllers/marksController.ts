import { Response } from "express";

import { AuthRequest } from "../middleware/authMiddleware";
import Marks from "../models/marks";

// GET all marks for a specific student
export const getMarksByStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.query;

    if (!studentId || typeof studentId !== "string") {
      return res.status(400).json({ message: "studentId query parameter is required" });
    }

    const records = await Marks.find({ studentId });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch marks", error });
  }
};

// SAVE marks (bulk create/update)
export const saveMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { records } = req.body;
    // records: [{ studentId, studentName, rollNumber, subject, marks }, ...]

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Records array is required" });
    }

    const savedRecords = await Promise.all(
      records.map((record: any) =>
        Marks.findOneAndUpdate(
          { studentId: record.studentId, subject: record.subject },
          {
            studentId: record.studentId,
            studentName: record.studentName,
            rollNumber: record.rollNumber,
            subject: record.subject,
            marks: record.marks,
          },
          { new: true, upsert: true }
        )
      )
    );

    res.status(200).json({
      message: "Marks saved successfully",
      records: savedRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save marks", error });
  }
};