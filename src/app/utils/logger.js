const pino = require("pino");
const { AsyncLocalStorage } = require("async_hooks");

const loggerContext = new AsyncLocalStorage();

// eslint-disable-next-line complexity
function severity(label) {
  switch (label) {
    case "trace":
      return "DEBUG";
    case "debug":
      return "DEBUG";
    case "info":
      return "INFO";
    case "warn":
      return "WARNING";
    case "error":
      return "ERROR";
    case "fatal":
      return "CRITICAL";
    default:
      return "DEFAULT";
  }
}

function level(label) {
  return { severity: severity(label) };
}

const loggerPino = pino({
  formatters: { level },
  redact: {
    paths: [
      "Authorization",
      "request.headers.Authorization",
      "authorization",
      "error.headers.authorization",
      "error.authorization",
      "headers.authorization",
      "request.headers.authorization",
      "request.raw_headers.authorization"
    ],
    censor: "****"
  },
  serializers: {
    // eslint-disable-next-line complexity
    req(req) {
      return {
        method: req?.raw?.method,
        url: req?.raw?.url,
        path: req?.path,
        parameters: req?.parameters,
        headers: {
          "x-forwarded-for": req?.headers?.["x-forwarded-for"],
          "x-channel-id": req?.headers?.["x-channel-id"] || "NA"
        }
      };
    }
  },
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toLowerCase() : "info",
  messageKey: "message"
});

const loggerProxy = new Proxy(loggerPino, {
  get(target, property) {
    const store = loggerContext.getStore()?.get("logger");
    if (!store) {
      return target[property];
    }
    return store[property];
  }
});

const setLogger = (properties, callback = () => {}) => {
  const childLogger = loggerPino.child({ ...properties });
  const store = new Map().set("logger", childLogger);
  loggerContext.run(store, callback);
};

class logger {
  static info({ request, filename, message, ...rest }) {
    loggerProxy.info(
      {
        severity: "INFO",
        filename,
        request,
        ...rest
      },
      message
    );
  }

  static error({ request, filename, message, ...rest }) {
    loggerProxy.error(
      {
        severity: "ERROR",
        filename,
        request,
        ...rest
      },
      message
    );
  }

  static debug({ request, filename, message, ...rest }) {
    loggerProxy.debug(
      {
        severity: "DEBUG",
        filename,
        request,
        ...rest
      },
      message
    );
  }

  static warn({ request, filename, message, ...rest }) {
    loggerProxy.warn(
      {
        severity: "WARN",
        filename,
        request,
        ...rest
      },
      message
    );
  }
}

module.exports = { loggerContext, loggerProxy, loggerPino, setLogger, logger };
