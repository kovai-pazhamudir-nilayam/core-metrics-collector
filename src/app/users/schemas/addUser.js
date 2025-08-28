const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postAddUser = {
  tags: ["USERS"],
  summary: "This API is to create a user",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["full_name", "phone_number"],
    additionalProperties: false,
    properties: {
      full_name: { type: "string", minLength: 10 },
      phone_number: {
        type: "object",
        required: ["country_code", "number"],
        additionalProperties: false,
        properties: {
          country_code: { type: "string", enum: ["+91"] },
          number: { type: "string", minLength: 10, maxLength: 10 }
        }
      }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        user_id: { type: "string", format: "uuid" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postAddUser;
