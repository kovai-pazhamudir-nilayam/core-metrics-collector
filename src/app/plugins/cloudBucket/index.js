const fp = require("fastify-plugin");

const { Storage } = require("@google-cloud/storage");

const cloudStorage = new Storage();

const cloudBucketPlugin = async fastify => {
  try {
    const cloudBucket = cloudStorage.bucket(fastify.config.CLOUD_BUCKET_NAME);
    fastify.decorate("cloudBucket", cloudBucket);
  } catch (err) {
    fastify.log.error(err, "ERROR CREATING BUCKET Client");
  }
};

module.exports = fp(cloudBucketPlugin);
