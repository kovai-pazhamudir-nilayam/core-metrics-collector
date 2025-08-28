const { getCurrentTimestamp } = require("../../commons/helpers");
const downstreamCallsRepo = require("../repository/downstreamCalls");

function storeApplicationStatusService(fastify) {
  const { createApplicationStatus } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    const input = {
      ...body,
      metric_capture_at: getCurrentTimestamp()
    };
    createApplicationStatus({
      body: input,
      logTrace
    });
    return { success: true };
  };
}

module.exports = storeApplicationStatusService;
