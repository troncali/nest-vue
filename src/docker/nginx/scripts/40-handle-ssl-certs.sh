#!/bin/sh

ME=$(basename $0)
CERT_FILE="/etc/letsencrypt/live/${APP_DOMAIN}/fullchain.pem"

wait_for_certbot() {
	echo >&3 "$ME: Waiting for certbot to generate certificate"
	until [ -f "$CERT_FILE" ] ; do
		sleep 10
	done
}

echo >&3 "$ME: Looking for existing certificate: ${CERT_FILE}"
if [ ! -f "$CERT_FILE" ] ; then

	if [ ! "${CERTBOT_MODE}" == "local" ]; then
		echo >&3 "$ME: Certificate not found; starting nginx with temporary http configuration"
		nginx -c /etc/nginx/certbot.conf

		wait_for_certbot

		echo >&3 "$ME: Stopping temporary configuration"
		nginx -c /etc/nginx/certbot.conf -s quit
	else
		wait_for_certbot
	fi
fi
