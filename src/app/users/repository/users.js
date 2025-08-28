const { logQuery } = require("../../commons/helpers");
const { USER } = require("../commons/constants");

function userRepo(fastify) {
  async function createUser({ data, logTrace }) {
    const knex = this;
    const query = knex(USER.NAME).returning("*").insert(data);
    logQuery({
      logger: fastify.log,
      query,
      context: "Create User",
      logTrace
    });
    const response = await query;
    return response[0];
  }

  return {
    createUser
  };
}

module.exports = userRepo;
