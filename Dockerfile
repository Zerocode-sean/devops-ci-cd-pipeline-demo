FROM node:20-alpine

WORKDIR /app

COPY  package*.json ./

RUN npm ci --omit=dev

COPY app.js ./


EXPOSE 80

USER node


CMD ["node", "app.js"]