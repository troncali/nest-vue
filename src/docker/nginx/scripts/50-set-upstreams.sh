#!/bin/sh

ME=$(basename $0)

echo >&3 "$ME: Looking for existing upstreams"
if [ ! -e /tmp/confs/upstreams ]; then

	# Default to blue deployment
	DEPLOY_COLOR="blue"

	if [ -e /opt/flags/blue ]; then
		rm /opt/flags/blue
	elif [ -e /opt/flags/green ]; then
		DEPLOY_COLOR="green";
		rm /opt/flags/green
	else
		echo "$ME: No flag set (using default)";
	fi

	ln -s /etc/nginx/confs/${DEPLOY_COLOR}.conf /tmp/confs/upstreams
	echo >&3 "$ME: Set upstreams to ${DEPLOY_COLOR}.conf"
fi



