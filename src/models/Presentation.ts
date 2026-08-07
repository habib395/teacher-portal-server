import mongoose, { Schema, Document } from "mongoose";

export interface IPresentation extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  topic: string;
  subject: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
}

const presentationSchema = new Schema<IPresentation>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const Presentation = mongoose.model<IPresentation>("Presentation", presentationSchema);
export default Presentation;