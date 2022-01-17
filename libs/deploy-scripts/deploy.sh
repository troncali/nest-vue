#!/bin/sh

if [ -z $DEPLOY_COLOR ]; then
	. ./libs/deploy-scripts/color.sh $@
fi

. ./libs/deploy-scripts/backend.sh
. ./libs/deploy-scripts/frontend.sh
