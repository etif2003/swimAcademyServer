import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["Learning", "Training", "Therapy"],
      required: true,
    },

    targetAudience: {
      type: String,
      enum: ["Children", "Teens", "Adults", "Seniors"],
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Advanced", "Professional"],
    },

    image: {
      type: String,
      trim: true,
    },

    // 🔢 Participants
    maxParticipants: {
      type: Number,
      min: 1,
    },

    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📌 Course status
    status: {
      type: String,
      enum: ["Draft", "Active", "Inactive", "Completed"],
      default: "Draft",
    },

    // ⏱ Course structure
    durationWeeks: {
      type: Number,
      min: 1,
    },

    sessionsCount: {
      type: Number,
      min: 1,
    },

    // 📍 Location (if physical)
    location: {
      poolName: { type: String, trim: true },
      city: { type: String, trim: true },
    },

    // 👤 Course creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },

    createdByModel: {
      type: String,
      required: true,
      enum: ["Instructor", "School"],
    },
  },
  { timestamps: true },
);

// 🔍 Indexes for filtering and search
courseSchema.index({
  category: 1,
  targetAudience: 1,
  level: 1,
  status: 1,
  price: 1,
});

export const Course = mongoose.model("Course", courseSchema);
