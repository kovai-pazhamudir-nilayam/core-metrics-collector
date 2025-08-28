const createUserService = require("../services/createUsers");

function createUserHandler(fastify) {
  const createUser = createUserService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await createUser({ body, params, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = createUserHandler;
