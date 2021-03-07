# Target a small image size (but uses `musl libc` instead of `glibc`; use
# node:15 if `glibc` is required)
FROM node:15-alpine

RUN mkdir -p /home/node/app/build && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

# Use built files resulting from Jenkins pipeline
COPY --chown=node:node ./build ./build

# Leverage Yarn's Zero-Install feature for dependencies
COPY --chown=node:node [".pnp.cjs", ".yarnrc.yml", "package.json", "yarn.lock", "./"]
COPY --chown=node:node ./.yarn ./.yarn

EXPOSE ${BACKEND_PORT}

# Equivalent to `CMD ["yarn", "b-start:prod"]`, but calling safely for Yarn PnP
CMD ["node", "-r", "./.pnp.cjs", "build/src/backend/main.js"]