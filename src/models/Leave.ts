import mongoose, { Schema, Document } from "mongoose";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface ILeave extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  classGroupId: mongoose.Types.ObjectId;
  reason: string;
  fromDate: string;
  toDate: string;
  attachmentUrl?: string;
  status: LeaveStatus;
}

const leaveSchema = new Schema<ILeave>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true },
    reason: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    attachmentUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model<ILeave>("Leave", leaveSchema);
export default Leave;