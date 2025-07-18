FROM node:23.9.0-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
COPY scripts /app/scripts
ENV HUSKY=0
RUN npm install
COPY . /app/
RUN npx nest build
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
