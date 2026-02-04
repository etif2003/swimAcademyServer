import {
  createSchoolService,
  getSchoolByOwnerService,
  getSchoolByIdService,
  getAllSchoolsService,
  updateSchoolService,
  deleteSchoolService,
} from "../services/school.js";

import { serverResponse } from "../utils/server-response.js";

   //CREATE SCHOOL
export const createSchoolController = async (req, res) => {
  try {
    const school = await createSchoolService(req.body);
    serverResponse(res, 201, school);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //GET SCHOOL BY OWNER
export const getSchoolByOwnerController = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const school = await getSchoolByOwnerService(ownerId);
    serverResponse(res, 200, school);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

   //GET SCHOOL BY ID
export const getSchoolByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await getSchoolByIdService(id);
    serverResponse(res, 200, school);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

  // GET ALL SCHOOLS
export const getAllSchoolsController = async (req, res) => {
  try {
    const schools = await getAllSchoolsService();
    serverResponse(res, 200, schools);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //UPDATE SCHOOL
export const updateSchoolController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSchool = await updateSchoolService(
      id,
      req.body
    );

    serverResponse(res, 200, updatedSchool);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

  // DELETE SCHOOL
export const deleteSchoolController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteSchoolService(id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};
