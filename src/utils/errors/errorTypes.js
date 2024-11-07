export const ERRORS = {
  WRONG_TYPES: { defaultMessage: "Wrong type", defaultStatusCode: 400, name: "wrong_types" },
  NOT_FOUND: { defaultMessage: "Resource not found", defaultStatusCode: 404, name: "not_found" },
  DATABASE: { defaultMessage: "Database error", defaultStatusCode: 500, name: "database_error" },
  UNHANDLED: { defaultMessage: "Unhandled error", defaultStatusCode: 500, name: "unhandled_error" },
  INVALID_BODY: { defaultMessage: "The body provided is invalid", defaultStatusCode: 400, name: "invalid_body" },
  NO_ID: { defaultMessage: "There was no Id provided", defaultStatusCode: 400, name: "no_id" },
  UPLOAD_FILE: { defaultMessage: "There was an error while uploading the file", defaultStatusCode: 400, name: "upload_file" },
};
