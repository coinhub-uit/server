ARG NODE_VERSION="23.9.0"
ARG ALPINE_VERSION=""

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /app
COPY --chown=app:app package.json package-lock.json /app/
COPY --chown=app:app scripts /app/

FROM base AS deps-production
ENV HUSKY=0
RUN npm ci --omit=dev

FROM deps-production AS build
COPY --chown=app:app . /app/
RUN npm run build

FROM base AS production
COPY --from=deps-production --chown=app:app /app/node_modules/ /app/
COPY --from=build --chown=app:app /app/dist/ /app/
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
