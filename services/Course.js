import { Course } from "../models/Course.js";
import { Instructor } from "../models/Instructor.js";
import { School } from "../models/School.js";
import { Registration } from "../models/Registration.js";
import { MESSAGES } from "../utils/constants/messages.js";

import {
  validateObjectId,
  validateNonEmptyUpdate,
} from "../validators/common.validators.js";

import {
  validateCreateCoursePayload,
  validateCourseCategory,
  validateCourseArea,
} from "../validators/course.validators.js";

// =======================
// HELPER
// =======================
const resolveCreatorIdFromUser = async (user) => {
  if (user.role === "Instructor") {
    const instructor = await Instructor.findOne({ user: user._id });
    if (!instructor) throw new Error("פרופיל מדריך לא נמצא");
    return instructor._id;
  }

  if (user.role === "School") {
    const school = await School.findOne({ owner: user._id });
    if (!school) throw new Error("בית ספר לא נמצא");
    return school._id;
  }

  throw new Error("אין הרשאה");
};

// =======================
// CREATE
// =======================
export const createCourseService = async (data) => {
  validateCreateCoursePayload(data);
  validateObjectId(data.creatorId, MESSAGES.COURSE.INVALID_CREATOR_ID);

  if (data.creatorType === "Instructor") {
    const instructor = await Instructor.findById(data.creatorId);
    if (!instructor) throw new Error(MESSAGES.INSTRUCTOR.NOT_FOUND);
  }

  if (data.creatorType === "School") {
    const school = await School.findById(data.creatorId);
    if (!school) throw new Error(MESSAGES.SCHOOL.NOT_FOUND);
  }

  const exists = await Course.exists({
    title: data.title,
    createdBy: data.creatorId,
    createdByModel: data.creatorType,
  });

  if (exists) throw new Error(MESSAGES.COURSE.ALREADY_EXISTS);

  return Course.create({
    ...data,
    createdBy: data.creatorId,
    createdByModel: data.creatorType,
  });
};

// =======================
// GET ALL
// =======================
export const getAllCoursesService = async () => {
  return Course.find({ status: "Active" }).sort({ createdAt: -1 });
};

// =======================
// GET BY ID
// =======================
export const getCourseByIdService = async (id) => {
  validateObjectId(id, MESSAGES.COURSE.INVALID_ID);

  const course = await Course.findById(id).populate("createdBy");

  if (!course) throw new Error(MESSAGES.COURSE.NOT_FOUND);

  return course;
};

// =======================
// GET MY COURSES
// =======================
export const getMyCoursesService = async (user) => {
  const creatorId = await resolveCreatorIdFromUser(user);

  return Course.find({
    createdBy: creatorId,
    createdByModel: user.role,
  }).sort({ createdAt: -1 });
};

// =======================
// GET BY CREATOR
// =======================
export const getCoursesByCreatorService = async ({
  creatorId,
  creatorType,
}) => {
  validateObjectId(creatorId, MESSAGES.COURSE.INVALID_CREATOR_ID);

  return Course.find({
    createdBy: creatorId,
    createdByModel: creatorType,
  }).sort({ createdAt: -1 });
};

// =======================
// UPDATE
// =======================
export const updateCourseService = async (id, data, user) => {
  validateObjectId(id, MESSAGES.COURSE.INVALID_ID);
  validateNonEmptyUpdate(data);

  const course = await Course.findById(id);
  if (!course) throw new Error(MESSAGES.COURSE.NOT_FOUND);

  const creatorId = await resolveCreatorIdFromUser(user);

  if (
    course.createdBy.toString() !== creatorId.toString() ||
    course.createdByModel !== user.role
  ) {
    throw new Error(MESSAGES.COURSE.NO_PERMISSION);
  }

  const forbidden = ["_id", "createdBy", "createdByModel"];
  forbidden.forEach((f) => delete data[f]);

  if (data.category) validateCourseCategory(data.category);
  if (data.area !== undefined) validateCourseArea(data.area);

  return Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// =======================
// DELETE
// =======================
export const deleteCourseService = async (id, user) => {
  validateObjectId(id, MESSAGES.COURSE.INVALID_ID);

  const course = await Course.findById(id);
  if (!course) throw new Error(MESSAGES.COURSE.NOT_FOUND);

  const creatorId = await resolveCreatorIdFromUser(user);

  if (
    course.createdBy.toString() !== creatorId.toString() ||
    course.createdByModel !== user.role
  ) {
    throw new Error(MESSAGES.COURSE.NO_PERMISSION);
  }

  const registrations = await Registration.find({ course: id });

  if (registrations.length > 0) {
    course.status = "Inactive";
    await course.save();
    return { message: MESSAGES.COURSE.HAS_REGISTRATIONS };
  }

  await course.deleteOne();
  return { message: MESSAGES.COURSE.DELETED_SUCCESS };
};
