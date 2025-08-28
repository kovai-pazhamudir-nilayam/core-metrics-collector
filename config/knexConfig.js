const path = require("path");

const defaultDbConfig = {
  client: "postgres",
  pool: {
    min: Math.trunc(process.env.DB_MIN_CONNECTION || 2),
    max: Math.trunc(process.env.DB_MAX_CONNECTION || 10)
  },
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: "knex_migrations",
    directory: path.resolve(__dirname, "../migrations")
  }
};

module.exports = {
  ...defaultDbConfig,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionTimeoutMillis: Math.trunc(process.env.DB_CONNECTION_TIMEOUT),
    statementTimeout: Math.trunc(process.env.DB_STATEMENT_TIMEOUT)
  },
  asyncStackTraces: false,
  debug: false
};
