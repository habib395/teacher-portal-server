import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  subject: string;
  deadline: string; // format: "YYYY-MM-DD"
  submittedBy: mongoose.Types.ObjectId[]; // student ids যারা submit করেছে
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    deadline: { type: String, required: true },
    submittedBy: [{ type: Schema.Types.ObjectId, ref: "Student", default: [] }],
  },
  { timestamps: true }
);

const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;