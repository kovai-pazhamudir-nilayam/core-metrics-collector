const fp = require("fastify-plugin");

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const getSaltFromSecretManager = async fastify => {
  const client = new SecretManagerServiceClient();
  const secretName = `projects/${process.env.GCP_PROJECT_ID}/secrets/${fastify.config.WALLET_SECRET_NAME}/versions/latest`;
  const [version] = await client.accessSecretVersion({
    name: secretName
  });
  const payload = version.payload.data.toString();
  return payload;
};

const getSecretSalt = fastify => async () => {
  const secretKey = fastify.memCache.get("SECRET_KEY");
  if (secretKey) {
    return secretKey;
  }
  const key = await getSaltFromSecretManager(fastify);
  fastify.memCache.set("SECRET_KEY", key);
  return key;
};

const getWalletSecret = async fastify => {
  try {
    fastify.decorate("getWalletSecret", getSecretSalt(fastify));
  } catch (err) {
    fastify.log.error(err, "ERROR CREATING CACHE");
  }
};

module.exports = fp(getWalletSecret);
