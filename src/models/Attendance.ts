import mongoose, { Schema, Document } from "mongoose";

export type AttendanceStatus = "present" | "absent";

interface IAttendanceEntry {
  studentId: mongoose.Types.ObjectId;
  status: AttendanceStatus;
}

export interface IAttendance extends Document {
  classGroupId: mongoose.Types.ObjectId;
  date: string;
  createdByTeacherId: mongoose.Types.ObjectId;
  records: IAttendanceEntry[];
}

const attendanceEntrySchema = new Schema<IAttendanceEntry>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
  },
  { _id: false }
);

const attendanceSchema = new Schema<IAttendance>(
  {
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true },
    date: { type: String, required: true },
    createdByTeacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    records: { type: [attendanceEntrySchema], default: [] },
  },
  { timestamps: true }
);

// একই class + date এর duplicate document তৈরি না হয়
attendanceSchema.index({ classGroupId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;