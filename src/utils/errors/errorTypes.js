export const ERRORS = {
  WRONG_TYPES: { defaultMessage: "Wrong type", defaultStatusCode: 400, name: "wrong_types" },
  NOT_FOUND: { defaultMessage: "Resource not found", defaultStatusCode: 404, name: "not_found" },
  DATABASE: { defaultMessage: "Database error", defaultStatusCode: 500, name: "database_error" },
  UNHANDLED: { defaultMessage: "Unhandled error", defaultStatusCode: 500, name: "unhandled_error" },
  INVALID_BODY: { defaultMessage: "The body provided is invalid", defaultStatusCode: 400, name: "invalid_body" },
  NO_ID: { defaultMessage: "The was no Id provided", defaultStatusCode: 400, name: "no_id" },
};
