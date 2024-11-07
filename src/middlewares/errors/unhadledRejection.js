import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export const unhandledRejection = (err) => {
  const error = createCustomError(ERRORS.UNHANDLED, err.message);
  console.log("Unhandled Rejection ", error);
};
