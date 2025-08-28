const basic = require("./basic");
const paramsValidation = require("./paramsValidation");
const unstructuredError = require("./unstructuredError");
const postgressError = require("./postgressError");
const msSqlError = require("./msSqlError");
const dataStoreError = require("./dataStoreError");
const cloudBucketError = require("./cloudBucketError");

module.exports = {
  paramsValidation,
  unstructuredError,
  postgressError,
  msSqlError,
  DEFAULT_MAPPERS: [
    basic,
    paramsValidation,
    postgressError,
    msSqlError,
    dataStoreError,
    cloudBucketError,
    unstructuredError
  ]
};
