import mongoose, { Schema, Document } from "mongoose";

export interface IMarks extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  rollNumber: string;
  subject: string;
  marks: number;
}

const marksSchema = new Schema<IMarks>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);


marksSchema.index({ studentId: 1, subject: 1 }, { unique: true });

const Marks = mongoose.model<IMarks>("Marks", marksSchema);
export default Marks;