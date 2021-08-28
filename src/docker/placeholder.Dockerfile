FROM node:alpine

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node ./src/docker/placeholder/app.js .

USER node

EXPOSE ${BACKEND_PORT}

CMD ["node", "app.js"]
