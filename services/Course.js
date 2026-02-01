import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { Instructor } from "../models/Instructor.js";
import { School } from "../models/School.js";
import { Registration } from "../models/Registration.js";

/* ===== helpers ===== */

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const allowedCreators = ["Instructor", "School"];
const allowedCategories = ["לימוד", "הכשרה", "טיפולי"];

/* =====================
   CREATE COURSE
===================== */
export const createCourseService = async ({
  creatorId,
  creatorType, // "Instructor" | "School"
  title,
  description,
  price,
  category,
  targetAudience,
  level,
  image,
}) => {
  if (!creatorId || !creatorType) {
    throw new Error("חסר יוצר לקורס");
  }

  if (!isValidObjectId(creatorId)) {
    throw new Error("מזהה יוצר לא תקין");
  }

  if (!allowedCreators.includes(creatorType)) {
    throw new Error("סוג יוצר לא חוקי");
  }

  if (!title || !description || price === undefined || !category || !targetAudience) {
    throw new Error("חסרים שדות חובה לקורס");
  }

  if (!allowedCategories.includes(category)) {
    throw new Error("קטגוריית קורס לא חוקית");
  }

  if (typeof price !== "number" || price < 0) {
    throw new Error("מחיר הקורס אינו תקין");
  }

  // בדיקה שהיוצר קיים
  if (creatorType === "Instructor") {
    const instructor = await Instructor.findById(creatorId);
    if (!instructor) throw new Error("מדריך לא נמצא");
  }

  if (creatorType === "School") {
    const school = await School.findById(creatorId);
    if (!school) throw new Error("בית ספר לא נמצא");
  }

  // מניעת קורס כפול לאותו יוצר
  const existingCourse = await Course.findOne({
    title,
    createdBy: creatorId,
    createdByModel: creatorType,
  });

  if (existingCourse) {
    throw new Error("כבר קיים קורס עם שם זה");
  }

  const course = await Course.create({
    title,
    description,
    price,
    category,
    targetAudience,
    level,
    image,
    status: "טיוטה",
    createdBy: creatorId,
    createdByModel: creatorType,
  });

  return course;
};

/* =====================
   GET ALL COURSES
===================== */
export const getAllCoursesService = async () => {
  return Course.find({ status: "פעיל" })
    .sort({ createdAt: -1 });
};

/* =====================
   GET COURSE BY ID
===================== */
export const getCourseByIdService = async (courseId) => {
  if (!isValidObjectId(courseId)) {
    throw new Error("מזהה קורס לא תקין");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("קורס לא נמצא");
  }

  return course;
};

/* =====================
   GET COURSES BY CREATOR
===================== */
export const getCoursesByCreatorService = async ({
  creatorId,
  creatorType,
}) => {
  if (!isValidObjectId(creatorId)) {
    throw new Error("מזהה יוצר לא תקין");
  }

  if (!allowedCreators.includes(creatorType)) {
    throw new Error("סוג יוצר לא חוקי");
  }

  return Course.find({
    createdBy: creatorId,
    createdByModel: creatorType,
  }).sort({ createdAt: -1 });
};

/* =====================
   UPDATE COURSE
===================== */
export const updateCourseService = async (
  courseId,
  data,
  user // req.user
) => {
  if (!isValidObjectId(courseId)) {
    throw new Error("מזהה קורס לא תקין");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("לא נשלחו נתונים לעדכון");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("קורס לא נמצא");
  }

  // // 🔐 בדיקת בעלות
  // if (
  //   course.createdBy.toString() !== user._id.toString() ||
  //   course.createdByModel !== user.role
  // ) {
  //   throw new Error("אין הרשאה לעדכן קורס זה");
  // }

  // שדות שאסור לעדכן
  const forbiddenFields = ["_id", "createdBy", "createdByModel"];
  forbiddenFields.forEach((field) => delete data[field]);

  if (data.category && !allowedCategories.includes(data.category)) {
    throw new Error("קטגוריית קורס לא חוקית");
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      throw new Error("מחיר הקורס אינו תקין");
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    data,
    { new: true, runValidators: true }
  );

  return updatedCourse;
};

/* =====================
   DELETE COURSE
===================== */
export const deleteCourseService = async (
  courseId,
  user // req.user
) => {
  if (!isValidObjectId(courseId)) {
    throw new Error("מזהה קורס לא תקין");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("קורס לא נמצא");
  }

  // // 🔐 בדיקת בעלות
  // if (
  //   course.createdBy.toString() !== user._id.toString() ||
  //   course.createdByModel !== user.role
  // ) {
  //   throw new Error("אין הרשאה למחוק קורס זה");
  // }

  const registrationsCount = await Registration.countDocuments({
    course: courseId,
  });

  if (registrationsCount > 0) {
    throw new Error("לא ניתן למחוק קורס שיש אליו נרשמים");
  }

  await course.deleteOne();

  return { message: "הקורס נמחק בהצלחה" };
};
