const schemas = require("../schemas");

const handlers = require("../handlers");

async function routes(fastify) {
  // Capture application status
  fastify.route({
    method: "POST",
    url: "/capture",
    schema: schemas.storeApplicationStatus,
    handler: handlers.storeApplicationStatus(fastify)
  });
}

module.exports = routes;
