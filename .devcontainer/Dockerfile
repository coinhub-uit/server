ARG NODE_VERSION="23.9.0"
ARG ALPINE_VERSION=""

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

RUN apk add postgresql resdis --no-cache \
  npm install -g @nestjs/cli

