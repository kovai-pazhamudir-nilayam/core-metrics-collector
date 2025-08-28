exports.envSchema = {
  type: "object",
  properties: {
    DB_USER: {
      type: "string",
      default: "postgres"
    },
    DB_PASSWORD: {
      type: "string",
      default: "postgres"
    },
    DB_NAME: {
      type: "string",
      default: "postgres"
    },
    DB_HOST: {
      type: "string",
      default: "localhost"
    },
    DB_PORT: {
      type: "string",
      default: "5432"
    },
    DATASTORE_NAMESPACE: {
      type: "string"
    },
    CLOUD_BUCKET_NAME: {
      type: "string"
    },

    GCP_ZONE: { type: "string" },
    GCP_PROJECT_ID: { type: "string" },

    DEPLOYMENT_TYPE: {
      type: "string"
    },
    UDP_PORT: {
      type: "number"
    },
    METRICS_STATUS_EVENT_TOPIC: {
      type: "string"
    },
    OUTLET_ID: {
      type: "string"
    },
    BROADCAST_ADDRESS: {
      type: "string"
    },
    CORE_METRICS_SERVICE: {
      type: "string"
    },
    BFF_AUTHN_BFF_URL: {
      type: "string"
    }
  }
};
