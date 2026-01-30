import express from "express";
import {
  registerController,
  loginController,
  changePasswordController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  updateUserRoleController,
} from "../controllers/user.js";

const router = express.Router();


router.post("/register", registerController);

router.post("/login", loginController);

router.put("/change-password", changePasswordController);

router.put("/", updateUserController);

router.get("/", getAllUsersController);

router.get("/:id", getUserByIdController);

router.delete("/:id", deleteUserController);

router.put("/:id/role", updateUserRoleController);

export default router;
