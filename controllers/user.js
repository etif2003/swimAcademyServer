import {
  registerUserService,
  loginUserService,
  changePasswordService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  updateUserRoleService,
} from "../services/User.js";

import { serverResponse } from "../utils/server-response.js";

/* =====================
   PUBLIC
===================== */

// REGISTER
export const registerController = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    serverResponse(res, 201, user);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const data = await loginUserService(req.body);
    serverResponse(res, 200, data);
  } catch (err) {
    serverResponse(res, 401, { message: err.message });
  }
};

/* =====================
   AUTH REQUIRED
===================== */

// CHANGE PASSWORD (מחובר)
export const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService({
      userId: req.user._id, //  JWT
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// UPDATE MY USER
export const updateMyUserController = async (req, res) => {
  try {
    const updatedUser = await updateUserService(
      req.user._id, //  JWT
      req.body
    );
    serverResponse(res, 200, updatedUser);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// GET ME
export const getMeController = async (req, res) => {
  serverResponse(res, 200, req.user);
};

/* =====================
   ADMIN ONLY
===================== */

// GET ALL USERS
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    serverResponse(res, 200, users);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

// GET USER BY ID
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    serverResponse(res, 200, user);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

// DELETE USER
export const deleteUserController = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

// UPDATE USER ROLE
export const updateUserRoleController = async (req, res) => {
  try {
    const user = await updateUserRoleService(
      req.params.id,
      req.body.role
    );
    serverResponse(res, 200, user);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};
