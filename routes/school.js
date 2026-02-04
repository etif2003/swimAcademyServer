import express from "express";
import {
  createSchoolController,
  getSchoolByOwnerController,
  getSchoolByIdController,
  getAllSchoolsController,
  updateSchoolController,
  deleteSchoolController,
} from "../controllers/school.js";

const router = express.Router();

// יצירת בית ספר 
router.post("/", createSchoolController);


// שליפת בית ספר לפי owner 
router.get("/by-owner/:ownerId", getSchoolByOwnerController);

// שליפת בית ספר לפי ID
router.get("/:id", getSchoolByIdController);

// כל בתי הספר
router.get("/", getAllSchoolsController);


// עדכון בית ספר לפי ID
router.put("/:id", updateSchoolController);


// מחיקת בית ספר לפי ID
router.delete("/:id", deleteSchoolController);

export default router;
