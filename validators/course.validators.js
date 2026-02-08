import {
  validateEnum,
  validateRequiredFields,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";
import { AREAS } from "../utils/constants/areas.js";


// =======================
// Domain enums
// =======================
export const ALLOWED_CREATORS = ["Instructor", "School"];
export const ALLOWED_CATEGORIES = [
  "Learning",
  "Training",
  "Therapy",
];

// =======================
// CREATE COURSE validation
// =======================
export const validateCreateCoursePayload = (data) => {
  validateRequiredFields({
    creatorId: data.creatorId,
    creatorType: data.creatorType,
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    targetAudience: data.targetAudience,
    area: data.area, 

  });

  validateEnum(
    data.creatorType,
    ALLOWED_CREATORS,
    MESSAGES.COURSE.INVALID_CREATOR_TYPE
  );

  validateEnum(
    data.category,
    ALLOWED_CATEGORIES,
    MESSAGES.COURSE.INVALID_CATEGORY
  );
  validateEnum(
  data.area,
  AREAS,
  MESSAGES.COURSE.INVALID_AREA
    );


  if (typeof data.price !== "number" || data.price < 0) {
    throw new Error(MESSAGES.COURSE.INVALID_PRICE);
  }
};

// =======================
// UPDATE COURSE validation
// =======================
export const validateCourseCategory = (category) => {
  validateEnum(
    category,
    ALLOWED_CATEGORIES,
    MESSAGES.COURSE.INVALID_CATEGORY
  );
};

export const validateCourseArea = (area) => {
  validateEnum(
    area,
    AREAS,
    MESSAGES.COURSE.INVALID_AREA
  );
};

