import { Response } from "express";
import Student from "../models/Student";
import User from "../models/User";   
import { AuthRequest } from "../middleware/authMiddleware";
import  bcrypt  from 'bcryptjs';

// GET all students
export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error });
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, className, rollNumber, classGroupId } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A login account with this email already exists" });
    }

    const newStudent = await Student.create({
      name,
      email,
      className,
      rollNumber,
      classGroupId: classGroupId || undefined,
    });

    const defaultPassword = "student123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentProfile: newStudent._id,
    });

    res.status(201).json({
      ...newStudent.toObject(),
      defaultPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error });
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, className, rollNumber, classGroupId } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, className, rollNumber, classGroupId: classGroupId || undefined },
      { returnDocument: 'after' }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    await User.findOneAndUpdate({ studentProfile: id }, { name, email });

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    await User.findOneAndDelete({ studentProfile: id });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error });
  }
};