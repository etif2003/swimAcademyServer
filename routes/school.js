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

/* =====================
   CREATE SCHOOL
===================== */
// יצירת בית ספר (ownerId מגיע ב-body)
router.post("/", createSchoolController);

/* =====================
   GET SCHOOL
===================== */

// שליפת בית ספר לפי owner (user)
router.get("/by-owner/:ownerId", getSchoolByOwnerController);

// שליפת בית ספר לפי ID
router.get("/:id", getSchoolByIdController);

// כל בתי הספר
router.get("/", getAllSchoolsController);

/* =====================
   UPDATE SCHOOL
===================== */
// עדכון בית ספר לפי ID
router.put("/:id", updateSchoolController);

/* =====================
   DELETE SCHOOL
===================== */
// מחיקת בית ספר לפי ID
router.delete("/:id", deleteSchoolController);

export default router;
