import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  subject: string;
  phone: string;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;