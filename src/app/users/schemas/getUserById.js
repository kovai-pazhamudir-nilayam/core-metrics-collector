const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getUserById = {
  tags: ["WALLET"],
  summary: "This API is to get wallet balance for a customer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      userId: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        user_id: { type: "string", format: "uuid" },
        full_name: { type: "string" },
        phone_number: {
          type: "object",
          properties: {
            country_code: { type: "string" },
            number: { type: "string" }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getUserById;
