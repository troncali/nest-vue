#!/bin/sh

# Apply permissions for nginx to read certificates
chown -R ${NGINX_UID}:${NGINX_GID} /etc/letsencrypt

# Set flag to reload nginx with new certificate
touch /opt/certbot/flags/restart_nginx
