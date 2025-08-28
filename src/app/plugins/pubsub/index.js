const _ = require("lodash");
const fp = require("fastify-plugin");
const { v4: uuidV4 } = require("uuid");
const { PubSub } = require("@google-cloud/pubsub");
const { logger } = require("../../utils/logger");

const pubSubClient = new PubSub();

const RETRY_POLICY = {
  retryPolicy: {
    minimumBackoff: { seconds: 60 },
    maximumBackoff: { seconds: 300 }
  }
};

const getSubscriptionList = ({ fastify }) => {
  const { OUTLET_ID } = fastify.config;
  return [
    {
      topicName: "device-monitoring-events",
      filterExpression: `attributes.outlet_id = "${OUTLET_ID}"`
    }
  ];
};

async function ensureSubscriptionExists({
  fastify,
  topicName,
  subscriptionName,
  options = {}
}) {
  try {
    await pubSubClient.subscription(subscriptionName).get();
    fastify.log.info({
      message: `Subscription ${subscriptionName} already exists.`
    });
    return subscriptionName;
  } catch (error) {
    if (error.code === 5) {
      fastify.log.info({
        message: `Subscription ${subscriptionName} does not exist. Creating it now...`
      });
      await pubSubClient
        .topic(topicName)
        .createSubscription(subscriptionName, options);
      fastify.log.info({
        message: `Subscription ${subscriptionName} created.`
      });
    } else {
      fastify.log.error({ message: "Error checking subscription:", error });
      throw error;
    }
    return subscriptionName;
  }
}

async function publishMessage({ eventData, eventAttributes, topicName }) {
  const messageId = await pubSubClient
    .topic(topicName)
    .publishMessage({ data: eventData, attributes: eventAttributes });
  return { messageId };
}

const createEvent = ({
  data,
  entityType,
  eventType,
  entityId = "",
  outletId,
  version
}) => {
  const uuid = uuidV4();
  const date = new Date();

  return {
    eventAttributes: {
      event_id: uuid,
      event_type: eventType,
      entity_id: entityId,
      entity_type: entityType,
      outlet_id: outletId,
      mime_type: "application/json",
      version,
      timestamp: String(date.getTime()),
      datetime: new Date().toISOString()
    },
    eventData: Buffer.from(JSON.stringify(data))
  };
};

const publishEventWrapper = () => {
  return async ({ data, eventInfo, version = "1.0" }) => {
    const { entityType, eventType, entityId, topicName, outletId } = eventInfo;
    const { eventData, eventAttributes } = createEvent({
      data,
      entityType,
      eventType,
      outletId,
      entityId,
      version
    });
    try {
      const { messageId } = await publishMessage({
        eventData,
        eventAttributes,
        topicName
      });
      logger.info({
        eventInfo,
        message: `Event Publishing Completed To - ${topicName}`,
        messageId,
        data
      });
      return true;
    } catch (err) {
      logger.error({
        entityType,
        data,
        err,
        message: "Publish Message Failed"
      });
      return false;
    }
  };
};

const InitialisePubsubPull = fastify => {
  return async () => {
    if (!_.isEmpty(fastify.PubSubPull)) return;
    try {
      const { OUTLET_ID, DEPLOYMENT_TYPE } = fastify.config;

      const subscriptionsList = getSubscriptionList({ fastify });

      const ensureSubscriptionExistsPromises = subscriptionsList.map(
        subscription => {
          const subscriptionPrefix = `projects/${fastify.config.GCP_PROJECT_ID}/subscriptions`;
          const { topicName, filterExpression } = subscription;
          const fullSubscriptionName =
            `${subscriptionPrefix}/${topicName}-store-${OUTLET_ID}-${DEPLOYMENT_TYPE}`.toLowerCase();

          return ensureSubscriptionExists({
            fastify,
            topicName,
            subscriptionName: fullSubscriptionName,
            options: { filter: filterExpression, ...RETRY_POLICY }
          });
        }
      );

      const [ApplicationMetricsStatusSubscriptioname] = await Promise.all(
        ensureSubscriptionExistsPromises
      );

      const StoreSubscriberOptions = {
        flowControl: { allowExcessMessages: false, maxMessages: 1 }
      };

      const ApplicationMetricsStatusSubscription = pubSubClient.subscription(
        ApplicationMetricsStatusSubscriptioname,
        StoreSubscriberOptions
      );

      // eslint-disable-next-line no-param-reassign
      fastify.PubSubPull = { ApplicationMetricsStatusSubscription };
    } catch (error) {
      logger.error({ message: "PubSub Pull Initialisation Failed", error });
    }
  };
};

const PubsubPlugin = async fastify => {
  // await pubSubClient.subscription("").delete();

  fastify.decorate("InitialisePubsubPull", InitialisePubsubPull(fastify));

  fastify.decorate("PubSubPull", {});

  fastify.decorate("publishEvent", publishEventWrapper(fastify));
};

module.exports = fp(PubsubPlugin);
