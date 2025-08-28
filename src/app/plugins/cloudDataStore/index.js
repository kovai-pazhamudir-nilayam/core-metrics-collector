const fp = require("fastify-plugin");

const { Datastore } = require("@google-cloud/datastore");

const cloudDataStorePlugin = async fastify => {
  try {
    const dataStore = new Datastore({
      namespace: fastify.config.DATASTORE_NAMESPACE
    });
    fastify.decorate("dataStore", dataStore);
  } catch (err) {
    fastify.log.error(err, "ERROR CREATING DATASTORE Client");
  }
};

module.exports = fp(cloudDataStorePlugin);
