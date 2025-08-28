require("dotenv").config();
const _ = require("lodash");
const fastifyEnv = require("@fastify/env");
const fastifyHealthcheck = require("fastify-healthcheck");
const envSchema = require("env-schema");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");
const fastifyMetrics = require("fastify-metrics");

const { envSchema: schema } = require("./app/commons/schemas/envSchemas");
const ConsumePubsubEvents = require("./app/events");
const applicationMetricStatusRoutes = require("./app/app-metrics/routes");

// PLUGINS
const ajv = require("./app/plugins/ajv");
const httpClient = require("./app/plugins/httpClient");
const pubsubPlugin = require("./app/plugins/pubsub");

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
  await fastify.register(pubsubPlugin);
  await fastify.register(swagger, SWAGGER_CONFIGS);
  await fastify.register(swaggerUi, SWAGGER_UI_CONFIGS);

  // ROUTES
  await fastify.register(applicationMetricStatusRoutes, {
    prefix: "/v1/metrics-collector"
  });

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
  if (_.isEmpty(fastify.PubSubPull)) ConsumePubsubEvents(fastify);
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
