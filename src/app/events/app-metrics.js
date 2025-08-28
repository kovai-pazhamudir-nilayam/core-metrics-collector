/* eslint-disable no-bitwise */
/* eslint-disable max-depth */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable complexity */
const dgram = require("dgram");
// const os = require("os");
const { logger } = require("../utils/logger");

// function getBroadcastAddresses() {
//   const interfaces = os.networkInterfaces();
//   const broadcastAddresses = [];

//   for (const interfaceName in interfaces) {
//     const addresses = interfaces[interfaceName];
//     for (const addressInfo of addresses) {
//       if (addressInfo.family === "IPv4" && !addressInfo.internal) {
//         const ip = addressInfo.address;
//         const { netmask } = addressInfo;

//         const ipParts = ip.split(".").map(Number);
//         const netmaskParts = netmask.split(".").map(Number);

//         const broadcastParts = [];
//         // eslint-disable-next-line no-plusplus
//         for (let i = 0; i < 4; i++) {
//           broadcastParts.push(ipParts[i] | (~netmaskParts[i] & 255));
//         }

//         const broadcastAddress = broadcastParts.join(".");
//         broadcastAddresses.push(broadcastAddress);
//       }
//     }
//   }
//   return broadcastAddresses;
// }

function createUdpEmitterServer({
  fastify,
  eventData,
  // udpPort,
  // broadcastAddress,
  // eventType,
  logTrace
}) {
  const udpClient = dgram.createSocket("udp4");
  const { DB_HOST } = fastify.config;

  // const [broadcastAddresses] = getBroadcastAddresses();

  console.log("-----------------------------------------");
  console.log("Broadcast Addresses:", DB_HOST);

  const { UDP_PORT } = fastify.config;

  try {
    udpClient.bind(() => {
      udpClient.setBroadcast(true);
    });

    const udpMessage = Buffer.from(
      JSON.stringify({
        event: "SEND_POS_APP_METRICS",
        payload: eventData
      })
    );

    udpClient.send(udpMessage, 0, udpMessage.length, UDP_PORT, DB_HOST, err => {
      if (err) {
        fastify.log.error({ message: "UDP send error", error: err });
      }

      fastify.log.info({
        message: "UDP message sent successfully",
        to: `${DB_HOST}:${UDP_PORT}`,
        data: udpMessage.toString()
      });

      // try {
      //   await fastify.publishEvent({
      //     data: udpMessage,
      //     event_info: {
      //       entity_type: "APPLICATION_STATUS_EVENT",
      //       event_type: eventType,
      //       outlet_id: fastify.config.outlet_id,
      //       topic_name: fastify.config.APPLICATION_STATUS_EVENT_TOPIC
      //     },
      //     logTrace
      //   });
      // } catch (error) {
      //   fastify.log.error({ message: "Failed to publish to PubSub", error });
      // }

      udpClient.close();
    });
  } catch (error) {
    fastify.log.error({
      message: "UDP emitter setup failed",
      error,
      logTrace
    });
  }
}

const eventHandlers = {
  METRICS_STATUS: {
    METRICS_STATUS_CREATED: createUdpEmitterServer
  }
};

const messageHandler = fastify => async message => {
  const { data, attributes } = message;
  const eventData = JSON.parse(Buffer.from(data, "base64"));
  logger.info({
    message: "Decoded Metrics Event",
    data: { attributes, eventData }
  });

  if (eventData.outlet_id !== fastify.config.OUTLET_ID) {
    message.ack();
    return;
  }
  const eventHandler =
    eventHandlers[attributes?.entity_type]?.[attributes?.event_type];

  try {
    if (!eventHandler) {
      message.ack();
      return;
    }
    eventHandler({ fastify, eventData });
    message.ack();
  } catch (error) {
    logger.error({
      message: `Metrics Storage Failed`,
      error,
      data: eventData
    });
    message.nack();
  }
};

const errorHandler = () => error => {
  logger.error({ message: "Error", error });
};

const ConsumeApplicationMetricsStatusEvents = async ({ fastify }) => {
  const subscription = fastify.PubSubPull.ApplicationMetricsStatusSubscription;

  subscription.on("message", messageHandler(fastify));
  subscription.on("error", errorHandler(fastify));
};

module.exports = { ConsumeApplicationMetricsStatusEvents };
