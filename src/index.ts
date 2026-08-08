import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import studentRoutes from "./routes/studentRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import marksRoutes from "./routes/marksRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import presentationRoutes from "./routes/presentationRoutes";
import studyMaterialRoutes from "./routes/studyMaterialRoutes";
import courseRoutes from "./routes/courseRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import leaveRoutes from "./routes/leaveRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Class Teacher Portal API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/presentations", presentationRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use("/api/leaves", leaveRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});