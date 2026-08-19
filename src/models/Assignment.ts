import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  subject: string;
  deadline: string;
  submittedBy: mongoose.Types.ObjectId[];
  classGroupId: mongoose.Types.ObjectId;
  createdByTeacherId: mongoose.Types.ObjectId;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    deadline: { type: String, required: true },
    submittedBy: [{ type: Schema.Types.ObjectId, ref: "Student", default: [] }],
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true },
    createdByTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;