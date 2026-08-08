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

// CREATE a student
export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, className, rollNumber } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    // ১. প্রথমে students কালেকশনে স্টুডেন্ট তৈরি করা
    const newStudent = await Student.create({ name, email, className, rollNumber });

    // ২. পাসওয়ার্ড হ্যাশ করা
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "123456", salt);

    // ৩. বাধ্যতামূলকভাবে users কালেকশনে ইউজার অ্যাকাউন্ট তৈরি করা (এই অংশটি আপনার কোডে মিসিং ছিল)
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentProfile: newStudent._id,
    });

    res.status(201).json({ message: "Student and user account created successfully", newStudent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error });
  }
};

// UPDATE a student
export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, className, rollNumber } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, className, rollNumber },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error });
  }
};

// DELETE a student
export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error });
  }
};