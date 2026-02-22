import mongoose from "mongoose";

const schoolInstructorSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },

    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    role: {
      type: String,
      enum: ["Primary", "Assistant", "Substitute"],
      default: "Primary",
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive"
    },

    hoursPerWeek: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

schoolInstructorSchema.index(
  { instructor: 1, school: 1 },
  { unique: true }
);


export const SchoolInstructor = mongoose.model(
  "SchoolInstructor",
  schoolInstructorSchema
);