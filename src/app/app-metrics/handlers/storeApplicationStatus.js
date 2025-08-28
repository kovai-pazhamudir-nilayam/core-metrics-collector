const storeApplicationStatusService = require("../services/storeApplicationStatus");

const posApplicationStatusEventHandler = fastify => {
  const storeApplicationStatus = storeApplicationStatusService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await storeApplicationStatus({
      body,
      logTrace
    });
    return reply.code(201).send(response);
  };
};

module.exports = posApplicationStatusEventHandler;
