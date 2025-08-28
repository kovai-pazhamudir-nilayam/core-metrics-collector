const _ = require("lodash");
const { ConsumeApplicationMetricsStatusEvents } = require("./app-metrics");

const ConsumeEvents = async fastify => {
  await fastify.InitialisePubsubPull();
  if (!_.isEmpty(fastify.PubSubPull)) {
    await ConsumeApplicationMetricsStatusEvents({ fastify });
  }
};

module.exports = ConsumeEvents;
