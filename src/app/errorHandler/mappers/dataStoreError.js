const CustomError = require("../CustomError");
const { DATASTORE_ERRORS } = require("../constants");

module.exports = error => {
  if (error.code && DATASTORE_ERRORS[error.code]) {
    const { statusCode, errorCode } = DATASTORE_ERRORS[error.code];
    const detail = error.detail || error.stack;
    const fieldName = error.column;
    return CustomError.create({
      httpCode: statusCode,
      message: detail,
      property: fieldName,
      code: errorCode
    });
  }
  return undefined;
};
