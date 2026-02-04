import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

const allowedRoles = ["Student", "Instructor", "School"];

//helpers 
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isStrongPassword = (password) => {
  return password && password.length >= 6;
};

const isValidPhone = (phone) => {
  const regex = /^05\d{8}$/;
  return regex.test(phone);
};

//REGISTER
export const registerUserService = async ({
  fullName,
  email,
  phone,
  password,
  role,
}) => {
  if (!fullName || !email || !phone || !password) {
    throw new Error("חסרים שדות חובה");
  }

  if (!isValidEmail(email)) {
    throw new Error("כתובת האימייל אינה תקינה");
  }

  if (!isValidPhone(phone)) {
    throw new Error("מספר הטלפון אינו תקין");
  }

  if (!isStrongPassword(password)) {
    throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("משתמש עם אימייל זה כבר קיים");
  }

  if (role && !allowedRoles.includes(role)) {
    throw new Error("תפקיד לא חוקי");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = await User.create({
    fullName,
    email,
    phone,
    password: hash,
    role,
  });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

//LOGIN
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("יש להזין אימייל וסיסמה");
  }

  if (!isValidEmail(email)) {
    throw new Error("כתובת האימייל אינה תקינה");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("אימייל או סיסמה שגויים");
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error("אימייל או סיסמה שגויים");
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

//CHANGE PASSWORD
export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  if (!currentPassword || !newPassword) {
    throw new Error("יש להזין סיסמה נוכחית וסיסמה חדשה");
  }

  if (!isStrongPassword(newPassword)) {
    throw new Error("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("הסיסמה הנוכחית שגויה");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  user.password = hash;
  await user.save();

  return { message: "הסיסמה עודכנה בהצלחה" };
};

//GET ALL USERS
export const getAllUsersService = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

//GET USER BY ID
export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  return user;
};

//UPDATE USER
export const updateUserService = async (userId, data) => {
  if (!userId) {
    throw new Error("מזהה משתמש חסר");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("לא נשלחו נתונים לעדכון");
  }

  // שדות שאסור לעדכן
  const forbiddenFields = ["password", "role", "_id"];
  forbiddenFields.forEach((field) => {
    if (data[field]) {
      delete data[field];
    }
  });

  // ולידציית אימייל
  if (data.email) {
    if (!isValidEmail(data.email)) {
      throw new Error("כתובת האימייל אינה תקינה");
    }

    const emailExists = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });

    if (emailExists) {
      throw new Error("האימייל כבר נמצא בשימוש");
    }
  }

  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error("מספר הטלפון אינו תקין");
  }

  const user = await User.findByIdAndUpdate(userId, data, { new: true }).select(
    "-password",
  );

  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  return user;
};

//DELETE USER
export const deleteUserService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("מזהה משתמש לא תקין");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("משתמש לא נמצא");

  // בדיקות לפי סוג משתמש
  if (user.role === "Student") {
    const registrations = await Registration.find({ student: userId });
    if (registrations.length > 0) {
      user.status = "Inactive";
      await user.save();
      return {
        message: "סטודנט לא נמחק כי יש לו הרשמות, הסטטוס הועבר ל'לא פעיל'",
      };
    }
  }

  if (user.role === "Instructor") {
    const courses = await Course.find({
      createdBy: userId,
      createdByModel: "Instructor",
    });
    if (courses.length > 0) {
      user.status = "Inactive";
      await user.save();
      return {
        message: "מדריך לא נמחק כי יש לו קורסים, הסטטוס הועבר ל'לא פעיל'",
      };
    }
  }

  if (user.role === "School") {
    const courses = await Course.find({
      createdBy: userId,
      createdByModel: "School",
    });
    if (courses.length > 0) {
      user.status = "Inactive";
      await user.save();
      return {
        message:
          "בית ספר לא נמחק כי יש לו קורסים פעילים, הסטטוס הועבר ל'לא פעיל'",
      };
    }
  }

  // אין קשרים – אפשר למחוק
  await user.deleteOne();
  return { message: "המשתמש נמחק בהצלחה" };
};

//UPDATE USER ROLE
export const updateUserRoleService = async (userId, role) => {
  const allowedRoles = ["Student", "Instructor", "School", "Admin"];

  if (!allowedRoles.includes(role)) {
    throw new Error("תפקיד לא חוקי");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("-password");

  if (!user) {
    throw new Error("משתמש לא נמצא");
  }

  return user;
};
