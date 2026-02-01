import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      city: { type: String, trim: true },
      address: { type: String, trim: true },
    },

    logo: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    contactName: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    contactEmail: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["טיוטה", "מאושר", "מושעה"],
      default: "טיוטה",
    },
  },
  { timestamps: true }
);

// 🔍 אינדקסים לחיפוש
schoolSchema.index({
  name: 1,
  "location.city": 1,
  status: 1,
});

export const School = mongoose.model("School", schoolSchema);
