import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  message: string;
  postedBy: string;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    postedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Notice = mongoose.model<INotice>("Notice", noticeSchema);
export default Notice;