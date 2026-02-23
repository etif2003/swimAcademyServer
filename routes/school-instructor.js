import express from "express";
import {
  createSchoolInstructorController,
  getInstructorsBySchoolController,
  getSchoolsByInstructorController,
  updateSchoolInstructorController,
  deleteSchoolInstructorController,
  getPendingRequestsByInstructorController,
} from "../controllers/school-instructor.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// שיוך מדריך לבית ספר
router.post("/", authMiddleware, createSchoolInstructorController);

// כל המדריכים של בית ספר
router.get("/by-school/:schoolId", getInstructorsBySchoolController);

// כל בתי הספר של מדריך
router.get(
  "/by-instructor",
  authMiddleware,
  getSchoolsByInstructorController
); 
// בקשות ממתינות למדריך
router.get(
  "/pending",
  authMiddleware,
  getPendingRequestsByInstructorController
);
// עדכון שיוך
router.put("/:id", updateSchoolInstructorController);

// ביטול שיוך
router.delete("/:id", authMiddleware, deleteSchoolInstructorController);

export default router;
