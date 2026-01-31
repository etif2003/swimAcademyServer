import mongoose from "mongoose";
import { School } from "../models/School.js";
import { User } from "../models/User.js";

/* ===== helpers ===== */

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidPhone = (phone) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};

/* =====================
   CREATE SCHOOL
===================== */
export const createSchoolService = async ({
  ownerId,
  name,
  location,
  description,
  logo,
  contactName,
  contactPhone,
  image,
}) => {
  if (!ownerId) {
    throw new Error("מזהה משתמש חסר");
  }

  if (!isValidObjectId(ownerId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  if (!name) {
    throw new Error("שם בית הספר הוא שדה חובה");
  }

  const user = await User.findById(ownerId);
  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  if (user.role !== "school") {
    throw new Error("המשתמש אינו מוגדר כבעל בית ספר");
  }

  const existingSchool = await School.findOne({ owner: ownerId });
  if (existingSchool) {
    throw new Error("כבר קיים בית ספר למשתמש זה");
  }

  if (contactPhone && !isValidPhone(contactPhone)) {
    throw new Error("מספר טלפון ליצירת קשר אינו תקין");
  }

  const school = await School.create({
    owner: ownerId,
    name,
    location,
    description,
    logo,
    contactName,
    contactPhone,
    image,
  });

  return school;
};

/* =====================
   GET SCHOOL BY OWNER
===================== */
export const getSchoolByOwnerService = async (ownerId) => {
  if (!isValidObjectId(ownerId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  const school = await School.findOne({ owner: ownerId });

  if (!school) {
    throw new Error("בית ספר לא נמצא");
  }

  return school;
};

/* =====================
   GET SCHOOL BY ID
===================== */
export const getSchoolByIdService = async (schoolId) => {
  if (!isValidObjectId(schoolId)) {
    throw new Error("מזהה בית ספר לא תקין");
  }

  const school = await School.findById(schoolId);

  if (!school) {
    throw new Error("בית ספר לא נמצא");
  }

  return school;
};

/* =====================
   GET ALL SCHOOLS
===================== */
export const getAllSchoolsService = async () => {
  return School.find().sort({ createdAt: -1 });
};

/* =====================
   UPDATE SCHOOL
===================== */
export const updateSchoolService = async (schoolId, data) => {
  if (!isValidObjectId(schoolId)) {
    throw new Error("מזהה בית ספר לא תקין");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("לא נשלחו נתונים לעדכון");
  }

  const forbiddenFields = ["_id", "owner"];
  forbiddenFields.forEach((field) => {
    if (field in data) {
      delete data[field];
    }
  });

  if (data.contactPhone && !isValidPhone(data.contactPhone)) {
    throw new Error("מספר טלפון ליצירת קשר אינו תקין");
  }

  const school = await School.findByIdAndUpdate(
    schoolId,
    data,
    { new: true }
  );

  if (!school) {
    throw new Error("בית ספר לא נמצא");
  }

  return school;
};

/* =====================
   DELETE SCHOOL
===================== */
export const deleteSchoolService = async (schoolId) => {
  if (!isValidObjectId(schoolId)) {
    throw new Error("מזהה בית ספר לא תקין");
  }

  const school = await School.findById(schoolId);
  if (!school) {
    throw new Error("בית ספר לא נמצא");
  }

  await school.deleteOne();

  return { message: "בית הספר נמחק בהצלחה" };
};
