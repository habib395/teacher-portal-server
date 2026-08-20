import mongoose, { Schema, Document } from "mongoose";

export type ClassSection = "College" | "Institute";

export interface IClassGroup extends Document {
  programName: string;
  yearName: string;
  section?: ClassSection;
}

const classGroupSchema = new Schema<IClassGroup>(
  {
    programName: { type: String, required: true },
    yearName: { type: String, required: true },
    section: { type: String, enum: ["College", "Institute"] },
  },
  { timestamps: true }
);

classGroupSchema.index({ programName: 1, yearName: 1, section: 1 }, { unique: true });

const ClassGroup = mongoose.model<IClassGroup>("ClassGroup", classGroupSchema);
export default ClassGroup;