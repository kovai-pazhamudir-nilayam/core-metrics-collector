async function requestLogging(request) {
  if (request.url !== "/health" && request.url !== "/metrics") {
    this.log.info({
      message: "Incoming Request",
      log_trace: request.logTrace,
      request: {
        url: request.url,
        method: request.method,
        query_params: request.query,
        body: request.body,
        raw_headers: request.headers
      }
    });
  }
}

async function responseLogging(request, reply) {
  if (request.url === "/health" || request.url === "/metrics") {
    return;
  }
  this.log.info({
    message: "Server Response",
    log_trace: request.logTrace,
    request: {
      url: request.url,
      method: request.method,
      query_params: request.query,
      body: request.body,
      raw_headers: request.headers
    },
    response: {
      status_code: reply.statusCode,
      response_time: reply.elapsedTime
    }
  });
}

function buildLogTrace(req, ...headers) {
  return headers.reduce(
    (logTrace, header) =>
      Object.assign(
        logTrace,
        req.headers[header] && {
          [header]: req.headers[header]
        }
      ),
    {}
  );
}

async function extractLogTrace(request) {
  request.logTrace = buildLogTrace(
    request,
    "x-request-id",
    "x-channel-id",
    "x-b3-traceid",
    "x-device-id",
    "x-app-version",
    "x-user-journey-id",
    "x-b3-spanid",
    "x-b3-parentspanid",
    "x-b3-sampled",
    "x-ot-span-context",
    "x-b3-flags"
  );
}
module.exports = {
  requestLogging,
  responseLogging,
  extractLogTrace
};
