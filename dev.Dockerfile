FROM node:23.9.0-alpine

WORKDIR /app

COPY --chown=app:app package.json package-lock.json /app/

RUN npm i

COPY --chown=app:app . /app/

CMD ["npm", "run", "start:dev"]
