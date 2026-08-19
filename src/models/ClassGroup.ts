import mongoose, { Schema, Document } from "mongoose";

export interface IClassGroup extends Document {
  programName: string; 
  yearName: string;    
}

const classGroupSchema = new Schema<IClassGroup>(
  {
    programName: { type: String, required: true },
    yearName: { type: String, required: true },
  },
  { timestamps: true }
);

classGroupSchema.index({ programName: 1, yearName: 1 }, { unique: true });

const ClassGroup = mongoose.model<IClassGroup>("ClassGroup", classGroupSchema);
export default ClassGroup;