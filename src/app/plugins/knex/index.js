const fp = require("fastify-plugin");
const knex = require("knex");
const setupPaginator = require("./paginator");
const { connectionCheck } = require("../../commons/helpers");

const knexPlugin = async (fastify, options) => {
  try {
    const db = knex({ ...options });
    setupPaginator(db);
    await connectionCheck(db);
    fastify.decorate("knex", db);
  } catch (e) {
    fastify.log.error(`DB connection failed`);
    throw Error(`Connection Failed ${e}`);
  }
};

module.exports = fp(knexPlugin);
