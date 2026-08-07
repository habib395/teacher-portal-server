import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  subject: string;
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    teacherName: { type: String, required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;