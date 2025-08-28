"use-strict";

const fp = require("fastify-plugin");
const Ajv = require("ajv");
const AjvKeywords = require("ajv-keywords");
const AjvErrors = require("ajv-errors");
const addFormats = require("ajv-formats");
const {
  commonRequestSchemas
} = require("../../commons/schemas/requestSchemas");
const {
  commonResponseSchemas
} = require("../../commons/schemas/responseSchemas");

const defaultAjvSettngs = {
  allErrors: true,
  removeAdditional: false,
  useDefaults: true
};
const defaultKeywords = ["transform", "uniqueItemProperties"];

const validateSchema =
  ajv =>
  ({ schema, data, key }) => {
    let validate = ajv.getSchema(key);
    if (!validate) {
      ajv.addSchema(schema, key);
      validate = ajv.getSchema(key);
    }
    if (!validate(data)) {
      return { success: false, errors: validate.errors };
    }
    return { success: true };
  };

// adding common schema in fastify
const addFastifySchema = mod =>
  [...commonRequestSchemas, ...commonResponseSchemas].forEach(schema =>
    mod.addSchema(schema)
  );

async function ajvPlugin(
  fastify,
  { settings = defaultAjvSettngs, keywords = defaultKeywords }
) {
  try {
    const ajv = new Ajv(settings);
    AjvKeywords(ajv, keywords);
    AjvErrors(ajv);
    addFormats(ajv);
    addFastifySchema(fastify);
    addFastifySchema(ajv);
    fastify.decorate("validateSchema", validateSchema(ajv));
    fastify.setValidatorCompiler(({ schema }) => {
      return ajv.compile(schema);
    });
  } catch (err) {
    fastify.log.error(err, err.message);
    fastify.log.error("AJV compilation failed");
    throw Error(`AJV compilation failed ${err}`);
  }
}

module.exports = fp(ajvPlugin);
