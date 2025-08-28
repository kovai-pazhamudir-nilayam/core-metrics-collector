const fp = require("fastify-plugin");
const NodeCache = require("node-cache");

const memoryCache = async fastify => {
  try {
    const memCache = new NodeCache();
    fastify.decorate("memCache", memCache);
  } catch (err) {
    fastify.log.error(err, "ERROR CREATING CACHE");
  }
};

module.exports = fp(memoryCache);
