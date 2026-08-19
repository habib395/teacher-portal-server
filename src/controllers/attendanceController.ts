import { Response } from "express";
import Attendance from "../models/Attendance";
import User from "../models/User";
import Teacher from "../models/Teacher"; 
import { AuthRequest } from "../middleware/authMiddleware";

// GET attendance by class and date
export const getAttendanceByClassAndDate = async (req: AuthRequest, res: Response) => {
  try {
    const { classGroupId, date } = req.query;

    if (!classGroupId || !date || typeof classGroupId !== "string" || typeof date !== "string") {
      return res.status(400).json({ message: "classGroupId and date query parameters are required" });
    }

    const attendanceRecord = await Attendance.findOne({ classGroupId, date });
    
    res.status(200).json(attendanceRecord || { records: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance", error });
  }
};

// SAVE attendance (Bulk save for a specific class and date)
export const saveAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { classGroupId, date, records } = req.body;
    const userId = req.user?.id;

    if (!classGroupId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "classGroupId, date, and records array are required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.teacherProfile) {
      return res.status(400).json({ message: "Teacher profile not found for this user" });
    }

    const teacher = await Teacher.findById(user.teacherProfile);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher record not found" });
    }

    if (!teacher.classTeacherOf || teacher.classTeacherOf.toString() !== classGroupId) {
      return res.status(403).json({ 
        message: "Access Denied! You are only allowed to give attendance for your assigned class." 
      });
    }

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { classGroupId, date },
      {
        classGroupId,
        createdByTeacherId: user.teacherProfile,
        date,
        records,
      },
      { returnDocument: 'after', upsert: true }
    );

    res.status(200).json({
      message: "Attendance saved successfully",
      attendance: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save attendance", error });
  }
};

// GET attendance summary for a specific student (for calculating attendance rate)
export const getAttendanceByStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.query;

    if (!studentId || typeof studentId !== "string") {
      return res.status(400).json({ message: "studentId query parameter is required" });
    }

    const attendanceDocs = await Attendance.find({ "records.studentId": studentId });

    let totalDays = 0;
    let presentDays = 0;

    attendanceDocs.forEach((doc) => {
      const studentRecord = doc.records.find(
        (r) => r.studentId.toString() === studentId
      );
      if (studentRecord) {
        totalDays++;
        if (studentRecord.status === "present") {
          presentDays++;
        }
      }
    });

    const attendanceRate =
      totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.status(200).json({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendanceRate,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance summary", error });
  }
};