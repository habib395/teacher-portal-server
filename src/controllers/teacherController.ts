import { Response } from "express";
import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher";
import User from "../models/User";
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

// CREATE a teacher (Admin) — Teacher + Login Account একসাথে তৈরি হয়
export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, subject, phone, classTeacherOf, teachingAssignments } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A login account with this email already exists" });
    }

    const newTeacher = await Teacher.create({
      name,
      email,
      subject,
      phone,
      classTeacherOf: classTeacherOf || undefined,
      teachingAssignments: teachingAssignments || [],
    });

    const defaultPassword = "teacher123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      teacherProfile: newTeacher._id,
    });

    res.status(201).json({
      ...newTeacher.toObject(),
      defaultPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create teacher", error });
  }
};

// UPDATE a teacher — Teacher এবং তার User account এর নাম/ইমেইল sync রাখা হয়
export const updateTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, subject, phone, classTeacherOf, teachingAssignments } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        name,
        email,
        subject,
        phone,
        classTeacherOf: classTeacherOf || undefined,
        teachingAssignments: teachingAssignments || [],
      },
      { returnDocument: 'after' }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // সংশ্লিষ্ট User এর name/email ও update করে দিন, যাতে দুই জায়গায় data mismatch না হয়
    await User.findOneAndUpdate({ teacherProfile: id }, { name, email });

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error });
  }
};

// DELETE a teacher — এর সাথে সংশ্লিষ্ট Login Account ও মুছে ফেলা হয় (orphan এড়াতে)
export const deleteTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // এই Teacher এর সাথে link করা User account টাও মুছে দিন
    await User.findOneAndDelete({ teacherProfile: id });

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error });
  }
};