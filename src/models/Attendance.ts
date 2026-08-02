import mongoose, { Schema, Document } from "mongoose";

export type AttendanceStatus = "present" | "absent";

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  rollNumber: string;
  date: string; // format: "YYYY-MM-DD"
  status: AttendanceStatus;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
  },
  { timestamps: true }
);

// একই student এর একই date এ যেন দুইবার record তৈরি না হয়
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;