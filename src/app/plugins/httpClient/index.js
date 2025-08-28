const fp = require("fastify-plugin");
const httpClient = require("./axios");
const Metrics = require("./metrics");
const { CustomError } = require("../../errorHandler");

function getTraceHeadersFromHeaders(headers) {
  const headerKeys = [
    "x-request-id",
    "x-b3-traceid",
    "x-b3-spanid",
    "x-b3-parentspanid",
    "x-b3-sampled",
    "x-ot-span-context",
    "x-b3-flags"
  ];

  return headerKeys.reduce(
    (logTrace, header) =>
      Object.assign(
        logTrace,
        headers[header] && {
          [header]: headers[header]
        }
      ),
    {}
  );
}

const httpClientWrapper =
  fastify =>
  // eslint-disable-next-line complexity
  async ({
    url,
    path,
    method,
    body,
    headers = {},
    timeout,
    downstream_system,
    source_system,
    domain,
    functionality,
    response_type,
    exclude_response_data_logging = false
  }) => {
    const common = {
      request: {
        url,
        method,
        data: body,
        path
      },
      log_trace: getTraceHeadersFromHeaders(headers),
      downstream_system,
      source_system,
      message: "REST Request Context:",
      domain,
      functionality
    };

    fastify.log.info(common);

    const mInstance = Metrics.init({
      status_code: 200,
      method,
      route: path
    });

    try {
      const response = await httpClient({
        url,
        method,
        headers,
        body,
        timeout,
        response_type
      });
      mInstance.updateStatus(response.status).consume();
      fastify.log.info({
        ...common,
        response: {
          ...(!exclude_response_data_logging && { data: response.data }),
          response_time: mInstance.getResponseTime(),
          status_code: response.status
        },
        message: "REST Response Context:"
      });
      return response.data;
    } catch (error) {
      mInstance.updateStatus(error?.response?.status || 500).consume();
      fastify.log.error({
        ...common,
        response: {
          error: error?.response?.data,
          response_time: mInstance.getResponseTime(),
          status_code: error?.response?.status || 500,
          raw_error: error
        },
        message: "REST Response Context:"
      });
      if (error?.response?.status) {
        throw CustomError.createHttpError({
          httpCode: error.response.status,
          errorResponse: error.response.data,
          downstream_system
        });
      }
      throw error;
    }
  };

const httpClientPlugin = async fastify => {
  fastify.decorate("request", httpClientWrapper(fastify));
};
module.exports = fp(httpClientPlugin);
