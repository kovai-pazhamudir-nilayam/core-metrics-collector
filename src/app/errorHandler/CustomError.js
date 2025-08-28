/* eslint-disable no-underscore-dangle */

const { formatDetail } = require("./helpers");
const { STATUS_CODES, STATUS_TEXTS } = require("./constants");

module.exports = class CustomError extends Error {
  constructor(httpCode, errors) {
    super();
    this._code = httpCode;
    this._errors = this.getErrorArr(errors);
  }

  getErrorArr(errors) {
    if (!errors || !errors?.length) {
      return [
        {
          message: STATUS_TEXTS[this._code],
          code: STATUS_CODES[this._code]
        }
      ];
    }
    return errors;
  }

  get code() {
    return this._code;
  }

  get response() {
    return {
      errors: this._errors
    };
  }

  static create({ httpCode, message, property, code }) {
    const errors = [this.parse(message, property, code)];
    return new CustomError(httpCode, errors);
  }

  static createHttpError({ httpCode, errorResponse, downstream_system }) {
    const errors = [];
    switch (downstream_system) {
      case "some-service":
        // Add downstream service specific Error Parsing Logic here
        errors.push({
          code: `SOME_SERVICE_${STATUS_CODES[httpCode]}`,
          message: errorResponse?.message
        });
        break;
      default:
        errors.push({
          code: "INTERNAL_SERVER_ERROR",
          message: errorResponse?.message
        });
    }
    return new CustomError(httpCode, errors);
  }

  static magentoMessageToCustomerMainErrorMapper(errorMessage) {
    const errorList = [
      {
        magento_error:
          "Magento customer id and customer_domain_id is not matched to update",
        customer_domain_error: {
          message: "Customer Id in Customer Domain and Magento is Not Matching",
          status_code: 500,
          code: "INTERNAL_SERVER_ERROR"
        }
      },
      {
        magento_error: "Please enter a valid pincode",
        customer_domain_error: {
          message: "Pincode Not Setup In Magento",
          status_code: 500,
          code: "INTERNAL_SERVER_ERROR"
        }
      },
      {
        magento_error: "Mobile number value is not valid",
        customer_domain_error: {
          message: "Invalid Mobile Number",
          status_code: 400,
          code: "BAD_REQUEST"
        }
      }
    ];

    const matchedError = errorList.find(val =>
      errorMessage.includes(val.magento_error)
    );

    return matchedError;
  }

  static getStatusCodeAndErrorFromMagentoError(error) {
    const matchedError = this.magentoMessageToCustomerMainErrorMapper(
      error.message
    );

    if (matchedError) {
      return {
        status_code: matchedError.customer_domain_error.status_code,
        errors: [
          {
            code: matchedError.customer_domain_error.code,
            message: matchedError.customer_domain_error.message
          }
        ]
      };
    }

    const errorCategory = this.getErrorCategory(error);
    switch (errorCategory) {
      case "graphql-authorization":
        return {
          status_code: 401,
          errors: [{ code: "UNAUTHORIZED", message: "Unauthorized" }]
        };
      case "graphql-input":
      case "graphql-no-such-entity": {
        return {
          status_code: 404,
          errors: [{ code: "NOT_FOUND", message: "Not Found" }]
        };
      }
      default:
        return {
          status_code: 500,
          errors: [
            { code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" }
          ]
        };
    }
  }

  static parse(message, property, code) {
    return {
      message: formatDetail(message),
      ...(property && { property }),
      code
    };
  }
};
