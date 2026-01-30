
//הערה חשובה: כרגע בפונקציות של איפוס סיסמא ועידכון משתמש השתמשתי בID שהגיע מגוף הבקשה בעתיד צריך לשנות שזה יגיע מJWT

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

//REGISTER
export const registerController = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    serverResponse(res, 201, user);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//LOGIN
export const loginController = async (req, res) => {
  try {
    const data = await loginUserService(req.body);
    serverResponse(res, 200, data);
  } catch (err) {
    serverResponse(res, 401, { message: err.message });
  }
};


//CHANGE PASSWORD
export const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService({
      userId: req.body.userId,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//GET ALL USERS (ADMIN)
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    serverResponse(res, 200, users);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//GET USER BY ID (ADMIN)
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    serverResponse(res, 200, user);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

//UPDATE USER
export const updateUserController = async (req, res) => {
  try {
    const { userId, ...data } = req.body;
    const updatedUser = await updateUserService(
      userId,
      data
    );
    serverResponse(res, 200, updatedUser);
  } catch (err) {
    serverResponse(res, 400, { message: err.message });
  }
};

//DELETE USER
export const deleteUserController = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);
    serverResponse(res, 200, result);
  } catch (err) {
    serverResponse(res, 404, { message: err.message });
  }
};

// UPDATE USER ROLE (ADMIN)
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
