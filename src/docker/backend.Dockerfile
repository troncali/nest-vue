# Reduce image bloat with a prebuild to gather production files and dependencies
FROM node:alpine AS prebuild
	WORKDIR /tmp
	# Use built files resulting from Jenkins pipeline
	COPY ./builds/backend ./builds/backend
	COPY [".pnp.cjs", ".yarnrc.yml", "package.json", "yarn.lock", "./"]
	COPY ./.yarn ./.yarn
	# Rebuild dependency executables specific to container platform
	# 1. Remove prior build artifacts in 'unplugged' folder
	# 2. Temporarily install required build tools - explanation in notes below
	# 3. Use yarn plugin to remove dev dependencies and rebuild executables
	# 4. Delete build tools because they are not needed in production image
	RUN rm -rf ./.yarn/unplugged && \
		apk add --no-cache --virtual build-deps python3 alpine-sdk autoconf libtool automake && \
		yarn prune-prod && apk del build-deps
		# More notes below about the yarn plugin and alternative approaches

# Build the production image
FROM node:alpine AS production
	RUN mkdir -p /home/node/app/builds && chown -R node:node /home/node/app
	WORKDIR /home/node/app
	USER node
	# Leverage Yarn's Zero-Install feature for production files and dependencies
	COPY --chown=node:node --from=prebuild /tmp .
	EXPOSE ${BACKEND_PORT}
	# Require .pnp.cjs for Yarn PnP's dependency resolution
	CMD ["node", "-r", "./.pnp.cjs", "builds/backend/main.js"]

# NOTES - Apline Linux & Build Tools
	# From nodejs/docker-node repository: "Alpine Linux is much smaller than
	# most distribution base images (~5MB), and thus leads to much slimmer
	# images in general. ... The main caveat to note is that it does use musl
	# libc instead of glibc and friends." Thus, some build tools need to be
	# added to the base image temporarily to build native executables.
	#
	# Resources:
	# - https://github.com/nodejs/docker-node/blob/main/README.md#nodealpine
	# - https://github.com/emilbayes/secure-password/issues/21#issuecomment-813278331

# NOTES - Yarn 'prune-prod' Plugin
	# This custom plugin is based on the 'focus' command from
	# @yarnpkg/workspace-tools. It is equivalent to running
	# 'yarn workspaces focus --all --production' in Yarn 3, which is similar
	# to 'yarn install --production' in Yarn 1 (omits devDependencies) but does
	# not prune the cache. The 'prune-prod' plugin first uses the cache to
	# "install" production dependencies and modify .pnp.cjs like the 'focus'
	# command, then clears the takes the additional step of clearing the cache
	# of dev dependencies.
	#
	# Alternative approaches: replace 'yarn prune-prod' with
	# 1. 'yarn rebuild'
	#    - Will use Yarn's Zero Install feature to persist all dependencies
	#      (no fetch required), including dev, and only rebuild executables.
	#    - Results in a higher image size (couple hundred megabytes), depending
	#      on your setup.
	# 2. 'yarn workspaces focus --all --production', and include
	# './.yarn/cache install-state.gz' in the first line of the RUN command as
	# an additional folder and file to remove.
	#    - Will result in a fresh fetch and install limited to non-dev
	#      dependencies.
	#    - Results in the same build size, but requires an inefficient, new
	#      fetch of dependencies that could differ from earlier in the pipeline.
	#
	# Resources:
	# - https://yarnpkg.com/cli/workspaces/focus
	# - https://github.com/yarnpkg/berry/issues/1789
	# - https://github.com/yarnpkg/berry/pull/1798/files
	# - https://github.com/yarnpkg/berry/blob/master/packages/plugin-workspace-tools/sources/commands/focus.ts
	# - https://raw.githubusercontent.com/troncali/yarn-prune-prod/main/bundles/%40yarnpkg/plugin-prune-prod.js
