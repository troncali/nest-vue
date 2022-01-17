#!/bin/sh

if [ -z $DEPLOY_COLOR ]; then
	. ./libs/deploy-scripts/color.sh $@
fi

echo "Deploying backend to ${DEPLOY_COLOR}"

# Stop current backend container if it's running
docker --context ${DOCKER_REMOTE_CONTEXT} stop backend-${DEPLOY_COLOR}
docker --context ${DOCKER_REMOTE_CONTEXT} rm -f backend-${DEPLOY_COLOR}

# Start backend container
docker --context ${DOCKER_REMOTE_CONTEXT} compose -p ${DOCKER_PROJECT_NAME} \
	-f docker-compose.yml -f ./src/docker/docker-compose-prod.yml \
	-f ./src/docker/docker-deploy-colors.yml up -d backend-${DEPLOY_COLOR}
