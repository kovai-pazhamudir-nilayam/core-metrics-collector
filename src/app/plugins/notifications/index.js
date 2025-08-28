const fp = require("fastify-plugin");

function getNotificationBody({ input, notificationEventId }) {
  return {
    message: {
      body: JSON.stringify(input),
      event_id: notificationEventId,
      header: {
        override_config: {
          phone_number: [input.contact_number],
          email_id: "some email"
        }
      }
    }
  };
}

function notificationWrapper(fastify) {
  async function sendNotification({
    inputData,
    logTrace,
    notificationEventId
  }) {
    const notificationBody = getNotificationBody({
      input: inputData,
      notificationEventId
    });
    try {
      const result = await this.service.rest({
        url: `${fastify.config.NOTIFICATION_SERVICE_URI}/v1/trigger`,
        method: "POST",
        headers: {
          "x-api-key": fastify.config.M2M_NOTIFICATION_TOKEN,
          ...logTrace
        },
        body: notificationBody,
        downstream_system: "notification-service",
        source_system: "ibo-wallet",
        domain: "user",
        functionality: "send notification"
      });
      return result;
    } catch (err) {
      fastify.log.error({
        message: "Error In Sending Noification",
        logTrace,
        error: err,
        data: notificationBody
      });
      return false;
    }
  }

  return sendNotification;
}

const generateHashPlugin = async fastify => {
  fastify.decorate("triggerNotification", notificationWrapper(fastify));
};

module.exports = fp(generateHashPlugin);
