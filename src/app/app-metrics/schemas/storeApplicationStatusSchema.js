const storeApplicationStatusSchema = {
  tags: ["Metrics"],
  summary: "This api will be used to post application status details",
  body: {
    type: "object",
    required: ["outlet_id"],
    properties: {
      dms_id: { type: "string" },
      outlet_id: { type: "string" },
      mac_address: { type: "string" },
      terminal_id: { type: "string" },
      register_id: { type: "string" },
      user_id: { type: "string" },
      upstream_type: { type: "string", enum: ["LOCAL", "REMOTE"] },
      type: { type: "string", enum: ["SERVER", "CLIENT"] },
      app_version: { type: "string" },
      last_order_at: { type: "string" },
      current_cart_id: { type: "string" },
      weighing_scale_status: { type: "string" },
      edc_type: { type: "string" },
      metric_capture_at: { type: "string", format: "date-time" },
      api_version: { type: "string" }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    }
  }
};

module.exports = storeApplicationStatusSchema;
