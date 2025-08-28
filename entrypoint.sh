#!/bin/sh
while ! curl -fIs localhost:15000/ready
do
  echo "waiting for envoy to be ready"
  sleep 1
done
echo "Running migrations"
node -r dotenv/config ./node_modules/.bin/knex --knexfile ./config/knexConfig.js migrate:latest || (echo "DB migration failed" && kill 1)
echo "Start application"
node src/index.js