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
      enum: ["student", "instructor", "school", "admin"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
