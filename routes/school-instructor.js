import express from "express";
import {
  createSchoolInstructorController,
  getInstructorsBySchoolController,
  getSchoolsByInstructorController,
  updateSchoolInstructorController,
  deleteSchoolInstructorController,
} from "../controllers/school-instructor.js";

const router = express.Router();

/* =====================
   CREATE
===================== */
// שיוך מדריך לבית ספר
router.post("/", createSchoolInstructorController);

/* =====================
   READ
===================== */
// כל המדריכים של בית ספר
router.get("/by-school/:schoolId", getInstructorsBySchoolController);

// כל בתי הספר של מדריך
router.get("/by-instructor/:instructorId", getSchoolsByInstructorController);

/* =====================
   UPDATE
===================== */
// עדכון שיוך
router.put("/:id", updateSchoolInstructorController);

/* =====================
   DELETE
===================== */
// ביטול שיוך (Soft delete)
router.delete("/:id", deleteSchoolInstructorController);

export default router;
