// const { getAuthToken } = require("@ebono-commerce/ebono-platform-token");

function downstreamCallsRepo(fastify) {
  async function createApplicationStatus({ body, logTrace }) {
    // const auth = await getAuthToken("PLATFORM");
    const response = fastify.request({
      url: `${fastify.config.CORE_METRICS_SERVICE}/v1/metrics`,
      method: "POST",
      headers: {
        ...logTrace,
        // Authorization: auth,
        "x-channel-id": "WEB"
      },
      body,
      path: "/core-metrics-service/v1/metrics",
      downstream_system: "core-metrics-service",
      source_system: "core-metrics-collector",
      domain: "POS",
      functionality: "Post metrics status"
    });
    return response;
  }

  return {
    createApplicationStatus
  };
}

module.exports = downstreamCallsRepo;
