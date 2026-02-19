import { Instructor } from "../models/Instructor.js";
import { School } from "../models/School.js";

import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  getCoursesByCreatorService,
  updateCourseService,
  deleteCourseService,
  getMyCoursesService,
} from "../services/Course.js";

import { serverResponse } from "../utils/server-response.js";

// =======================
// CREATE COURSE
// =======================
export const createCourseController = async (req, res) => {
  try {
    if (!["Instructor", "School"].includes(req.user.role)) {
      return serverResponse(res, 403, {
        message: "אין הרשאה ליצור קורס",
      });
    }

    let creatorId;
    let creatorType = req.user.role;

    if (req.user.role === "Instructor") {
      const instructor = await Instructor.findOne({
        user: req.user._id,
      });

      if (!instructor) {
        return serverResponse(res, 400, {
          message: "פרופיל מדריך לא נמצא",
        });
      }

      creatorId = instructor._id;
    }

    if (req.user.role === "School") {
      const school = await School.findOne({
        owner: req.user._id,
      });

      if (!school) {
        return serverResponse(res, 400, {
          message: "בית ספר לא נמצא",
        });
      }

      creatorId = school._id;
    }

    const course = await createCourseService({
      ...req.body,
      creatorId,
      creatorType,
    });

    serverResponse(res, 201, course);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// =======================
// GET ALL COURSES
// =======================
export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCoursesService();
    serverResponse(res, 200, courses);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// =======================
// GET COURSE BY ID
// =======================
export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseByIdService(req.params.id);
    serverResponse(res, 200, course);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

// =======================
// GET MY COURSES
// =======================
export const getMyCoursesController = async (req, res) => {
  try {
    const courses = await getMyCoursesService(req.user);
    serverResponse(res, 200, courses);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// =======================
// GET BY CREATOR
// =======================
export const getCoursesByCreatorController = async (req, res) => {
  try {
    const { creatorId, creatorType } = req.params;
    const courses = await getCoursesByCreatorService({
      creatorId,
      creatorType,
    });
    serverResponse(res, 200, courses);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// =======================
// UPDATE COURSE
// =======================
export const updateCourseController = async (req, res) => {
  try {
    const updated = await updateCourseService(
      req.params.id,
      req.body,
      req.user
    );

    serverResponse(res, 200, updated);
  } catch (err) {
    serverResponse(res, 403, { message: err.message });
  }
};

// =======================
// DELETE COURSE
// =======================
export const deleteCourseController = async (req, res) => {
  try {
    const result = await deleteCourseService(
      req.params.id,
      req.user
    );

    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 403, { message: err.message });
  }
};
