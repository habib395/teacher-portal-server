import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  message: string;
  postedBy: string;
  targetClassGroupId?: mongoose.Types.ObjectId; // না থাকলে সবার জন্য
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    postedBy: { type: String, required: true },
    targetClassGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup" },
  },
  { timestamps: true }
);

const Notice = mongoose.model<INotice>("Notice", noticeSchema);
export default Notice;