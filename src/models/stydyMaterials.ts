import { Schema, model, Document } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  subject: string;
  category: "PDF Notes" | "Video Lecture" | "Source Code" | "Assignment Guide";
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ["PDF Notes", "Video Lecture", "Source Code", "Assignment Guide"],
      required: true,
    },
    fileSize: { type: String, required: true },
    uploadDate: { type: String, required: true },
    downloadUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const StudyMaterial = model<IStudyMaterial>("StudyMaterial", studyMaterialSchema);