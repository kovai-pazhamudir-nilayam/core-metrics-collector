FROM node:20-alpine as builder

WORKDIR /app

ARG NPM_TOKEN

COPY . /app

RUN addgroup kpn && \
    adduser \
    --disabled-password \
    --gecos "" \
    --no-create-home \
    -G kpn  \
    kpn

# Upstream bug with hadolint ordering
# hadolint ignore=DL4006
RUN apk add --no-cache binutils=2.42-r0
RUN npm config set update-notifier false 
RUN npm ci --no-audit --production --ignore-scripts
RUN strip /usr/local/bin/node


FROM alpine:3.15
WORKDIR /app
COPY --from=builder /usr/local/bin/node /usr/bin/
COPY --from=builder /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=builder /app /app
#COPY --from=builder /app/node_modules /app/node_modules

RUN apk add --no-cache tini=0.19.0-r0 curl=8.5.0-r0

ENV PORT=4444 \
    NODE_ENV=production \
    MAX_EVENT_LOOP_DELAY=1000 \
    MAX_RSS_BYTES=0 \
    MAX_HEAP_USED_BYTES=0 \
    MAX_AGE=86400

EXPOSE $PORT

# an init entrypoint that simplifies signal handling
COPY entrypoint.sh /usr/bin/entrypoint
ENTRYPOINT ["tini", "--"]
CMD ["entrypoint"]