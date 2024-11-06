export const statusTypes = {
  SUCCESS: "success",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not_found",
};

const successResponse = (res, payload = "OK", status = 200) => {
  console.log("success response", payload);
  return res.status(status).json({ status: statusTypes.SUCCESS, payload });
};

const clientErrorResponse = (res, error = "Bad Request", status = 400) => {
  console.log("client error response", error);
  return res.status(status).json({
    status: statusTypes.ERROR,
    error,
  });
};
const serverErrorResponse = (res, error = "Internal Server Error", status = 500) => {
  console.log("server error response", error);
  return res.status(status).json({
    status: statusTypes.ERROR,
    error,
  });
};

const notFoundResponse = (res, error = "Resource not found", status = 404) => {
  console.log("notFound response", error);
  return res.status(status).json({
    status: statusTypes.NOT_FOUND,
    error,
  });
};

const unauthorizedResponse = (res, error = "Unauthorized", status = 401) => {
  console.log("unauthorized response", error);
  return res.status(status).json({
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
