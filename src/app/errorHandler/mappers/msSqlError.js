const CustomError = require("../CustomError");
const { MSSQL_DB_ERRORS } = require("../constants");

module.exports = error => {
  if (error.number && MSSQL_DB_ERRORS[error.number]) {
    const { statusCode, errorCode } = MSSQL_DB_ERRORS[error.number];
    const detail = error.message || error.stack;
    return CustomError.create({
      httpCode: statusCode,
      message: detail,
      code: errorCode
    });
  }
  return undefined;
};
