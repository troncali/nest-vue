#!/bin/sh

if [ -z $DEPLOY_COLOR ]; then
	. ./libs/deploy-scripts/color.sh $@
fi

echo "Deploying frontend to ${DEPLOY_COLOR}"

# Clear existing files
ssh ${SSH_HOST_ALIAS} "rm -rf /var/lib/docker/volumes/${DOCKER_PROJECT_NAME}_frontend-${DEPLOY_COLOR}/_data/{..?*,.[!.]*,*}"

# Copy frontend files
scp -r ./dist/frontend/* ${SSH_HOST_ALIAS}:/var/lib/docker/volumes/${DOCKER_PROJECT_NAME}_frontend-${DEPLOY_COLOR}/_data
