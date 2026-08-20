import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Student from "../models/Student";
import Teacher from "../models/Teacher";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      className,
      rollNumber,
      subject,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let studentProfileId = undefined;
    let teacherProfileId = undefined;

    if (role === "student") {
      const newStudentRecord = await Student.create({
        name,
        email,
        className: className || "Not Assigned",
        rollNumber: rollNumber || "N/A",
      });
      studentProfileId = newStudentRecord._id;
    }

    if (role === "teacher") {
      const newTeacherRecord = await Teacher.create({
        name,
        email,
        subject: subject || "Not Assigned",
        phone: phone || "N/A",
        teachingAssignments: [],
      });
      teacherProfileId = newTeacherRecord._id;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      studentProfile: studentProfileId,
      teacherProfile: teacherProfileId,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentProfile: newUser.studentProfile || null,
        teacherProfile: newUser.teacherProfile || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile || null,
        teacherProfile: user.teacherProfile || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id; 
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studentProfile: updatedUser.studentProfile || null,
        teacherProfile: updatedUser.teacherProfile || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};