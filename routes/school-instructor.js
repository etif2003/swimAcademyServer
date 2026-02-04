import express from "express";
import {
  createSchoolInstructorController,
  getInstructorsBySchoolController,
  getSchoolsByInstructorController,
  updateSchoolInstructorController,
  deleteSchoolInstructorController,
} from "../controllers/school-instructor.js";

const router = express.Router();

// שיוך מדריך לבית ספר
router.post("/", createSchoolInstructorController);


// כל המדריכים של בית ספר
router.get("/by-school/:schoolId", getInstructorsBySchoolController);

// כל בתי הספר של מדריך
router.get("/by-instructor/:instructorId", getSchoolsByInstructorController);


// עדכון שיוך
router.put("/:id", updateSchoolInstructorController);


// ביטול שיוך 
router.delete("/:id", deleteSchoolInstructorController);

export default router;
