import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  className: string;
  rollNumber: string;
  classGroupId?: mongoose.Types.ObjectId;
}

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    rollNumber: { type: String, required: true },
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup" },
  },
  { timestamps: true }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;