import express from "express";
import {
  createRegistrationController,
  getRegistrationsByUserController,
  getRegistrationsByCourseController,
  updateRegistrationStatusController,
  deleteRegistrationController,
} from "../controllers/registration.js";

const router = express.Router();

/* =====================
   CREATE REGISTRATION
===================== */
// הרשמה לקורס (userId + courseId מגיעים ב-body)
router.post("/", createRegistrationController);

/* =====================
   GET REGISTRATIONS
===================== */

// כל ההרשמות של משתמש
router.get(
  "/by-user/:userId",
  getRegistrationsByUserController
);

// כל ההרשמות לקורס
router.get(
  "/by-course/:courseId",
  getRegistrationsByCourseController
);

/* =====================
   UPDATE REGISTRATION STATUS
===================== */
// עדכון סטטוס הרשמה
router.put(
  "/:id/status",
  updateRegistrationStatusController
);

/* =====================
   DELETE REGISTRATION
===================== */
// ביטול הרשמה
router.delete("/:id", deleteRegistrationController);

export default router;
