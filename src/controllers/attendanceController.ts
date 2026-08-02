import { Response } from "express";
import Attendance from "../models/Attendance";
import { AuthRequest } from "../middleware/authMiddleware";

// GET attendance by date
export const getAttendanceByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Date query parameter is required" });
    }

    const records = await Attendance.find({ date });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance", error });
  }
};

// SAVE attendance (bulk create/update for a given date)
export const saveAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { date, records } = req.body;
    // records: [{ studentId, studentName, rollNumber, status }, ...]

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Date and records array are required" });
    }

    const savedRecords = await Promise.all(
      records.map((record: any) =>
        Attendance.findOneAndUpdate(
          { studentId: record.studentId, date },
          {
            studentId: record.studentId,
            studentName: record.studentName,
            rollNumber: record.rollNumber,
            date,
            status: record.status,
          },
          { new: true, upsert: true }
        )
      )
    );

    res.status(200).json({
      message: "Attendance saved successfully",
      records: savedRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save attendance", error });
  }
};