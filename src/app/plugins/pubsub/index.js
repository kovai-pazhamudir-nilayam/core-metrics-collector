const { v4: uuidv4 } = require("uuid");
const fp = require("fastify-plugin");
const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub();

async function publishMessage({ eventData, eventAttributes, topic_name }) {
  const messageId = await pubSubClient
    .topic(topic_name)
    .publishMessage({ data: eventData, attributes: eventAttributes });
  return { messageId };
}

const createEvent = ({ data, entity_type, event_type, version }) => {
  const uuid = uuidv4();
  const date = new Date();

  return {
    eventAttributes: {
      event_id: uuid,
      event_type,
      entity_type,
      timestamp: String(date.getTime()),
      datetime: new Date().toISOString(),
      mime_type: "application/json",
      version
    },
    eventData: Buffer.from(JSON.stringify(data))
  };
};

const publishEventWrapper = fastify => {
  return async ({ data, event_info, version = "1.0", logTrace }) => {
    const { entity_type, event_type, topic_name } = event_info;
    const { eventData, eventAttributes } = createEvent({
      data,
      entity_type,
      event_type,
      version
    });
    try {
      const { messageId } = await publishMessage({
        eventData,
        eventAttributes,
        topic_name
      });
      fastify.log.info({
        event_info,
        message: "Event publish completed",
        messageId,
        data,
        logTrace
      });
      return true;
    } catch (err) {
      fastify.log.error({
        event_info,
        data,
        err,
        message: "Publish message failed",
        logTrace
      });
      return false;
    }
  };
};

function parseEvent(fastify) {
  return ({ event }) => {
    const { message } = event;

    fastify.log.info({ message: "Raw Pubsub Message", data: message });

    const { data, attributes } = message;
    try {
      const parsedMessage = JSON.parse(Buffer.from(data, "base64"));
      fastify.log.info({
        message: "Parsed Pubsub Message",
        data: { parsedMessage, attributes }
      });
      return {
        payload: parsedMessage,
        attributes
      };
    } catch (err) {
      fastify.log.error({ message: "Error in parsing PubSub Message" });
      throw err;
    }
  };
}

const eventPlugin = async fastify => {
  fastify.decorate("publishEvent", publishEventWrapper(fastify));
  fastify.decorate("parseEvent", parseEvent(fastify));
};

module.exports = fp(eventPlugin);
