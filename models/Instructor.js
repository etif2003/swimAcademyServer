import mongoose from "mongoose";

const instructorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    experienceYears: {
      type: Number,
      min: 0,
    },

    certificates: {
      type: [String],
      default: [],
    },

    workArea: {
      type: String,
      required: true,
      trim: true,
    },

    hourlyRate: {
      type: Number,
      min: 0,
    },

    image: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["טיוטה", "מאושר", "מושעה"],
      default: "טיוטה",
    },

    available: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// אינדקסים לחיפוש
instructorProfileSchema.index({
  workArea: 1,
  available: 1,
  status: 1,
});

export const Instructor = mongoose.model(
  "Instructor",
  instructorProfileSchema
);
