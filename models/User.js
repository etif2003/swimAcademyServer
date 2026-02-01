import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["Student", "Instructor", "School", "Admin"],
      default: "Student",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },

    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
