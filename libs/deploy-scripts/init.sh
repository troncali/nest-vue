#!/bin/sh

docker --context $DOCKER_REMOTE_CONTEXT compose \
	-p $DOCKER_PROJECT_NAME -f docker-compose.yml \
	-f ./apps/docker/docker-compose-prod.yml up -d

. ./libs/deploy-scripts/frontend.sh production
