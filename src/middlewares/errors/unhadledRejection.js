import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export const unhandledRejection = (err) => {
  const error = createCustomError(ERRORS.UNHANDLED, err);
  console.log("Unhandled Rejection ", error);
};
