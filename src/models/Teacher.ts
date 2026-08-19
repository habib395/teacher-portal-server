import mongoose, { Schema, Document } from "mongoose";

export interface ITeachingAssignment {
  classGroupId: mongoose.Types.ObjectId;
  subject: string;
}

export interface ITeacher extends Document {
  name: string;
  email: string;
  subject: string; 
  phone: string;
  classTeacherOf?: mongoose.Types.ObjectId; 
  teachingAssignments: ITeachingAssignment[];
}

const teachingAssignmentSchema = new Schema<ITeachingAssignment>(
  {
    classGroupId: { type: Schema.Types.ObjectId, ref: "ClassGroup", required: true },
    subject: { type: String, required: true },
  },
  { _id: false }
);

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    phone: { type: String, required: true },
    classTeacherOf: { type: Schema.Types.ObjectId, ref: "ClassGroup" },
    teachingAssignments: { type: [teachingAssignmentSchema], default: [] },
  },
  { timestamps: true }
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;