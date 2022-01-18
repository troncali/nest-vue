FROM node:16.13.1-alpine3.14

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node ./apps/docker/src/placeholder/app.js .

USER node

EXPOSE ${BACKEND_PORT}

CMD ["node", "app.js"]
