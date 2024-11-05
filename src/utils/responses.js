export const statusTypes = {
  SUCCESS: "success",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not_found",
};

const successResponse = (res, payload = "OK", status = 200) => {
  res.status(status).json({ status: statusTypes.SUCCESS, payload });
};

const clientErrorResponse = (res, error = "Bad Request", status = 400) => {
  res.status(status).json({
    status: statusTypes.ERROR,
    error,
  });
};
const serverErrorResponse = (res, error = "Internal Server Error", status = 500) => {
  res.status(status).json({
    status: statusTypes.ERROR,
    error,
  });
};

const notFoundResponse = (res, error = "Resource not found") => {
  res.status(404).json({
    status: statusTypes.NOT_FOUND,
    error,
  });
};

const unauthorizedResponse = (res, error = "Unauthorized") => {
  res.status(401).json({
    status: statusTypes.UNAUTHORIZED,
    error,
  });
};

export default {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
};
