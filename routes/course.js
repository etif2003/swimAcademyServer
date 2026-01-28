import express from "express";
import {
  getAllCoursesController,
  getCourseByIdController,
  addCourseController,
  deleteCourseController,
  updateCourseController,
  resetCoursesController,
} from "../controllers/Course.js";

const router = express.Router();

router.get("/", getAllCoursesController);
router.get("/id/:id", getCourseByIdController);
router.post("/", addCourseController);
router.delete("/id/:id", deleteCourseController);
router.put("/id/:id", updateCourseController);
router.put("/reset", resetCoursesController);

export default router;
