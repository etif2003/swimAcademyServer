import {
  createRegistrationService,
  getRegistrationsByUserService,
  getRegistrationsByCourseService,
  updateRegistrationStatusService,
  deleteRegistrationService,
} from "../services/registration.js";

import { serverResponse } from "../utils/server-response.js";

   //CREATE REGISTRATION
export const createRegistrationController = async (req, res) => {
  try {
    const registration = await createRegistrationService({
      userId: req.user.id, 
      courseId: req.body.courseId,
    });




    serverResponse(res, 201, registration);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //GET REGISTRATIONS BY USER
export const getRegistrationsByUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations =
      await getRegistrationsByUserService(userId);

    serverResponse(res, 200, registrations);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //GET REGISTRATIONS BY COURSE
export const getRegistrationsByCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const registrations =
      await getRegistrationsByCourseService(courseId);

    serverResponse(res, 200, registrations);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //UPDATE REGISTRATION STATUS
export const updateRegistrationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRegistration =
      await updateRegistrationStatusService(id, status);

    serverResponse(res, 200, updatedRegistration);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

   //DELETE REGISTRATION
export const deleteRegistrationController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteRegistrationService(id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};
