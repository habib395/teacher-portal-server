import { Response } from "express";
import Course from "../models/Course";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all courses
export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
};

// CREATE a course
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { name, subject, teacherId, teacherName } = req.body;

    const newCourse = await Course.create({ name, subject, teacherId, teacherName });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course", error });
  }
};

// UPDATE a course
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subject, teacherId, teacherName } = req.body;

    const updated = await Course.findByIdAndUpdate(
      id,
      { name, subject, teacherId, teacherName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error });
  }
};

// DELETE a course
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error });
  }
};