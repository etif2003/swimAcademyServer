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
      enum: ["לימוד", "הכשרה", "טיפולי"],
      required: true,
    },

    targetAudience: {
      type: String,
      enum: ["ילדים", "נוער", "מבוגרים", "גיל הזהב"],
      required: true,
    },

    level: {
      type: String,
      enum: ["מתחילים", "מתקדמים", "מקצועי"],
    },

    image: {
      type: String,
      trim: true,
    },

    // 🔢 משתתפים
    maxParticipants: {
      type: Number,
      min: 1,
    },

    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📌 סטטוס קורס
    status: {
      type: String,
      enum: ["טיוטה", "פעיל", "לא פעיל", "הסתיים"],
      default: "טיוטה",
    },

    // ⏱ מבנה הקורס
    durationWeeks: {
      type: Number,
      min: 1,
    },

    sessionsCount: {
      type: Number,
      min: 1,
    },

    // 📍 מיקום (אם פיזי)
    location: {
      poolName: { type: String, trim: true },
      city: { type: String, trim: true },
    },

    // 👤 מי יצר את הקורס
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
  { timestamps: true }
);

// 🔍 אינדקסים לפילטרים וחיפוש
courseSchema.index({
  category: 1,
  targetAudience: 1,
  level: 1,
  status: 1,
  price: 1,
});

export const Course = mongoose.model("Course", courseSchema);
