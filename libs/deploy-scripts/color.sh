#!/bin/sh

if [ "${1}" == "production" ]
then
	DEPLOY_COLOR="$(curl -s https://${APP_DOMAIN}/id)"
else
	if [ "$(curl -s https://${APP_DOMAIN}/id)" == "${DEPLOY_COLOR:=blue}" ]
	then
		DEPLOY_COLOR=green
	fi
fi
