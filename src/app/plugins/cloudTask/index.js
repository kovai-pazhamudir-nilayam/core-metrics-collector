const fastifyPlugin = require("fastify-plugin");
const { CloudTasksClient } = require("@google-cloud/tasks");

const createHttpCloudTask =
  ({ fastify, client, default_queue, location, project }) =>
  async ({
    logTrace,
    url,
    queue,
    payload,
    delayInSeconds = 10,
    httpMethod = "POST"
  }) => {
    const parent = client.queuePath(project, location, queue || default_queue);

    const task = {
      scheduleTime: { seconds: delayInSeconds + Date.now() / 1000 },
      httpRequest: {
        httpMethod,
        url,
        ...(payload && {
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          headers: {
            "Content-Type": "application/json"
          }
        })
      }
    };

    fastify.log.info({
      message: "Cloud Task Request Details:",
      log_trace: logTrace,
      task_details: task
    });
    const request = { parent, task };
    const [response] = await client.createTask(request);
    fastify.log.info({
      message: "Created task Response Details",
      log_trace: logTrace,
      response
    });
  };

const cloudTasksPlugin = async fastify => {
  try {
    const client = new CloudTasksClient();
    const project = fastify.config.GCP_PROJECT_ID;
    const location = fastify.config.GCP_ZONE;
    const queue = fastify.config.MEDIA_PROCESS_QUEUE;

    fastify.decorate(
      "createCloudTask",
      createHttpCloudTask({
        fastify,
        project,
        location,
        client,
        default_queue: queue
      })
    );
  } catch (err) {
    fastify.log.error(err, "ERROR CREATING CLOUD TASK Client");
  }
};

module.exports = fastifyPlugin(cloudTasksPlugin);
