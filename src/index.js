require("dotenv").config();
const fastifyEnv = require("@fastify/env");
const fastifyHealthcheck = require("fastify-healthcheck");
const envSchema = require("env-schema");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");
const fastifyMetrics = require("fastify-metrics");

const { envSchema: schema } = require("./app/commons/schemas/envSchemas");
const { knexConfig } = require("../config/index");
const routes = require("./app/users/routes");

// PLUGINS
const ajv = require("./app/plugins/ajv");
const memCache = require("./app/plugins/mem-cache");
const knex = require("./app/plugins/knex");
const readGcpSecret = require("./app/plugins/readGcpSecret");
const httpClient = require("./app/plugins/httpClient");
const pubsub = require("./app/plugins/pubsub");
const cloudBucket = require("./app/plugins/cloudBucket");
const artifactPlugin = require("./app/plugins/artifact-file-upload");

const {
  extractLogTrace,
  requestLogging,
  responseLogging
} = require("./app/hooks/logging");

const {
  SWAGGER_CONFIGS,
  SWAGGER_UI_CONFIGS,
  SERVER_CONFIGS
} = require("./app/commons/configs");
const { METRICS_CONFIGS } = require("./app/commons/metrics.config");

const { errorHandler } = require("./app/errorHandler");

async function create() {
  // eslint-disable-next-line global-require
  const fastify = require("fastify")(SERVER_CONFIGS);

  fastify.setErrorHandler(errorHandler());
  await fastify.register(fastifyHealthcheck);

  // Env vars plugin
  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema
  });

  // HOOKS
  fastify.addHook("onRequest", extractLogTrace);
  fastify.addHook("preValidation", requestLogging);
  fastify.addHook("onResponse", responseLogging);

  // PLUGINS
  await fastify.register(ajv);
  await fastify.register(httpClient);
  await fastify.register(knex, knexConfig);
  await fastify.register(memCache);
  await fastify.register(readGcpSecret);
  await fastify.register(swagger, SWAGGER_CONFIGS);
  await fastify.register(swaggerUi, SWAGGER_UI_CONFIGS);
  await fastify.register(pubsub);
  await fastify.register(cloudBucket);
  await fastify.register(artifactPlugin);

  // ROUTES
  await fastify.register(routes, { prefix: "/v1" });

  // Fastify-metrics
  if (process.env.NODE_ENV !== "test") {
    await fastify.register(fastifyMetrics, METRICS_CONFIGS);
  }

  return fastify;
}

async function start() {
  const fastify = await create();
  const defaultSchema = {
    type: "object",
    properties: {
      HOST: {
        type: "string",
        default: "0.0.0.0"
      },
      PORT: {
        type: "integer",
        default: 4444
      }
    }
  };
  const config = envSchema({ schema: defaultSchema, dotenv: true });
  // Run the server!
  fastify.listen({ port: config.PORT, host: config.HOST }, (err, address) => {
    /* istanbul ignore next */
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(`server listening on ${address}`);
  });
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  start();
}

module.exports = {
  create,
  start
};
