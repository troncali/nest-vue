#!/bin/sh

if [ -z $DEPLOY_COLOR ]; then
	. ./libs/deploy-scripts/color.sh $@
fi

echo "Swapping $DEPLOY_COLOR to production"
# Update nginx upstreams based on deployment color
ssh $SSH_HOST_ALIAS \
	"rm /var/lib/docker/volumes/${DOCKER_PROJECT_NAME}_nginx-confs/_data/upstreams"
docker --context $DOCKER_REMOTE_CONTEXT exec nginx ln \
	-s /etc/nginx/confs/${DEPLOY_COLOR}.conf /tmp/confs/upstreams

echo "Gracefully reloading nginx configuration"
# Set flag to restart nginx; restart worker container to trigger now. (Worker
# checks nginx flags every 6 hours by default.)
ssh $SSH_HOST_ALIAS \
	"touch /var/lib/docker/volumes/${DOCKER_PROJECT_NAME}_worker-flags/_data/restart_nginx; \
	docker restart worker > /dev/null"
