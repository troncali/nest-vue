#!/bin/sh

if [ -z $DEPLOY_COLOR ]; then
	. ./libs/deploy-scripts/color.sh $@
fi

echo "Deploying placeholder to ${DEPLOY_COLOR}"

# Stop current backend container if it's running
docker --context ${DOCKER_REMOTE_CONTEXT} stop backend-${DEPLOY_COLOR}
docker --context ${DOCKER_REMOTE_CONTEXT} rm -f backend-${DEPLOY_COLOR}

# Start placeholder container
docker --context ${DOCKER_REMOTE_CONTEXT} compose -p ${DOCKER_PROJECT_NAME} \
	-f docker-compose.yml -f ./apps/docker/docker-compose-prod.yml \
	-f ./apps/docker/docker-deploy-colors.yml up -d placeholder-${DEPLOY_COLOR}
