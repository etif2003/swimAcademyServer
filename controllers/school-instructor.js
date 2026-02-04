import {
  createSchoolInstructorService,
  getInstructorsBySchoolService,
  getSchoolsByInstructorService,
  updateSchoolInstructorService,
  deleteSchoolInstructorService,
} from "../services/school-instructor.js";

import { serverResponse } from "../utils/server-response.js";

   //CREATE SCHOOL INSTRUCTOR
export const createSchoolInstructorController = async (req, res) => {
  try {
    const result = await createSchoolInstructorService(req.body);
    serverResponse(res, 201, result);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//GET INSTRUCTORS BY SCHOOL
export const getInstructorsBySchoolController = async (req, res) => {
  try {
    const result = await getInstructorsBySchoolService(req.params.schoolId);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};


   //GET SCHOOLS BY INSTRUCTOR

export const getSchoolsByInstructorController = async (req, res) => {
  try {
    const result = await getSchoolsByInstructorService(
      req.params.instructorId
    );
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};


   //UPDATE SCHOOL INSTRUCTOR
export const updateSchoolInstructorController = async (req, res) => {
  try {
    const result = await updateSchoolInstructorService(
      req.params.id,
      req.body
    );
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //DELETE SCHOOL INSTRUCTOR
export const deleteSchoolInstructorController = async (req, res) => {
  try {
    const result = await deleteSchoolInstructorService(req.params.id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};
