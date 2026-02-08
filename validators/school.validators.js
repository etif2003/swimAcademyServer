import {
    validateEnum,
  validateRequiredFields,
} from "./common.validators.js";
import { MESSAGES } from "../utils/constants/messages.js";
import { AREAS } from "../utils/constants/areas.js";


// =======================
// CREATE SCHOOL validation
// =======================
export const validateCreateSchoolPayload = (data) => {
  validateRequiredFields({
    ownerId: data.ownerId,
    name: data.name,
     area: data.area,
  });

   validateEnum(
    data.area,
    AREAS,
    MESSAGES.SCHOOL.INVALID_AREA
  );
};

export const validateSchoolArea = (area) => {
  validateEnum(
    area,
    AREAS,
    MESSAGES.SCHOOL.INVALID_AREA
  );
};

