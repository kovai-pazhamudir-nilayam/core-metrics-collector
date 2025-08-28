const {
  clientHistogram,
  clientSummary
} = require("../../commons/metrics.config");

module.exports = class Metrics {
  // data: { method: string, route: string, status_code: number };
  constructor(data) {
    const histogramMetrics = clientHistogram.startTimer();
    const summaryMetrics = clientSummary.startTimer();
    this.consumers = [histogramMetrics, summaryMetrics];
    this.timer = process.hrtime();
    this.data = data;
  }

  updateStatus(status) {
    this.data.status_code = status;
    return this;
  }

  consume() {
    this.consumers.forEach(consumer => {
      consumer(this.data);
    });
  }

  getResponseTime() {
    const responseTime = process.hrtime(this.timer);
    return responseTime[0] * 1e3 + responseTime[1] / 1e6;
  }

  static init(data) {
    return new Metrics(data);
  }
};
