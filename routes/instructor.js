import express from "express";
import {
  createInstructorController,
  getInstructorByUserController,
  getInstructorByIdController,
  getAllInstructorsController,
  updateInstructorController,
  deleteInstructorController,
} from "../controllers/instructor.js";

const router = express.Router();


// יצירת פרופיל מדריך (לפי userId)
router.post("/", createInstructorController);



// שליפת פרופיל מדריך לפי userId
router.get("/by-user/:userId", getInstructorByUserController);

// שליפת פרופיל מדריך לפי instructorId
router.get("/:id", getInstructorByIdController);

// כל המדריכים
router.get("/", getAllInstructorsController);


// עדכון פרופיל מדריך לפי instructorId
router.put("/:id", updateInstructorController);


// מחיקת פרופיל מדריך לפי instructorId
router.delete("/:id", deleteInstructorController);

export default router;
