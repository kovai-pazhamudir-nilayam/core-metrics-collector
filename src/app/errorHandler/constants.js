exports.STATUS_TEXTS = {
  400: "Bad request parameters",
  401: "Bad or expired token",
  403: "Insufficient permissions to perform an operation over a resource",
  404: "Resource Not Found",
  405: "Method not allowed",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout"
};

exports.STATUS_CODES = {
  301: "MOVED_PERMANENTLY",
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "REQUEST_FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  429: "TOO_MANY_REQUEST",
  405: "METHOD_NOT_ALLOWED",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
  ECONNRESET: "ECONNRESET"
};

exports.POSTGRES_DB_ERRORS = {
  23502: { statusCode: 400, errorCode: "NOT_NULL_VIOLATION" },
  23503: { statusCode: 400, errorCode: "FOREIGN_KEY_VIOLATION" },
  23505: { statusCode: 409, errorCode: "UNIQUE_KEY_VIOLATION" },
  23514: { statusCode: 400, errorCode: "INVALID_VALUE" }
};

exports.DATASTORE_ERRORS = {
  1: { statusCode: 499, errorCode: "DATASTORE_CANCELLED" },
  2: { statusCode: 500, errorCode: "DATASTORE_INTERNAL_SERVER_ERROR" },
  3: { statusCode: 400, errorCode: "DATASTORE_INVALID_ARGUMENT" },
  4: { statusCode: 504, errorCode: "DATASTORE_DEADLINE_EXCEEDED" },
  5: { statusCode: 404, errorCode: "DATASTORE_NOT_FOUND" },
  6: { statusCode: 409, errorCode: "DATASTORE_ALREADY_EXISTS" },
  7: { statusCode: 403, errorCode: "DATASTORE_PERMISSION_DENIED" },
  8: { statusCode: 429, errorCode: "DATASTORE_RESOURCE_EXHAUSTED" },
  9: { statusCode: 400, errorCode: "DATASTORE_FAILED_PRECONDITION" },
  10: { statusCode: 409, errorCode: "DATASTORE_ABORTED" },
  11: { statusCode: 400, errorCode: "DATASTORE_OUT_OF_RANGE" },
  12: { statusCode: 501, errorCode: "DATASTORE_UNIMPLEMENTED" },
  13: { statusCode: 500, errorCode: "DATASTORE_INTERNAL_SERVER_ERROR" },
  14: { statusCode: 503, errorCode: "DATASTORE_SERVICE_UNAVAILABLE" },
  15: { statusCode: 500, errorCode: "DATASTORE_DATA_LOSS" },
  16: { statusCode: 401, errorCode: "DATASTORE_UNAUTHENTICATED" }
};

exports.ERROR_LOGGING_MESSAGES = {
  fatal: "Fatal: Unhandled Error",
  paramsValidation: "Validation Error: Schema Validation Error",
  badRequest: "Validation Error: Bad Request",
  connectionError: "Validation Error: DB Connection Error",
  postgresError: "Validation Error: Postgres Error"
};
