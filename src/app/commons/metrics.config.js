const promClient = require("prom-client");

const METRICS_CONFIGS = {
  endpoint: "/metrics",
  routeMetrics: {
    overrides: {
      histogram: {
        name: "http_request_duration_seconds",
        help: "request duration in seconds",
        labelNames: ["status_code", "method", "route"],
        buckets: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      },
      summary: {
        name: "http_request_summary_seconds",
        help: "request duration in seconds summary",
        labelNames: ["status_code", "method", "route"],
        percentiles: [0.5, 0.95, 0.99]
      }
    }
  },
  name: "metrics",
  defaultMetrics: { enabled: true },
  clearRegisterOnInit: false
};

const clientHistogramOptions = {
  name: "http_client_request_duration_seconds",
  help: "Client request duration in seconds histogram",
  labelNames: ["status_code", "method", "route"],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
};

const clientSummaryOptions = {
  name: "http_client_request_summary_seconds",
  help: "Client request duration in seconds summary",
  labelNames: ["status_code", "method", "route"],
  percentiles: [0.5, 0.95, 0.99]
};

const clientHistogram = new promClient.Histogram(clientHistogramOptions);
const clientSummary = new promClient.Summary(clientSummaryOptions);

module.exports = {
  METRICS_CONFIGS,
  clientHistogram,
  clientSummary
};
