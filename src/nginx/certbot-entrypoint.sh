#!/bin/sh
set -e
if [ "${CERT_ENV}" == "dev" ]; then
    echo "Certificate environment: development"
    if [ -f ./dev-certs/fullchain.pem ]; then
        echo "Development certificates already exist"
        echo "To regenerate, delete certificates from /src/nginx/dev-certs"
    else
        echo "Generating development certificates for localhost"
        openssl req -x509 -nodes -new -sha256 -days 365 -newkey rsa:2048 \
            -keyout ./dev-certs/RootCA.key -out ./dev-certs/RootCA.pem \
            -subj "/C=US/CN=Localhost Root CA"
        openssl x509 -outform pem -in ./dev-certs/RootCA.pem \
            -out ./dev-certs/RootCA.crt
        openssl req -new -nodes -newkey rsa:2048 \
            -keyout ./dev-certs/privkey.pem -out ./dev-certs/localhost.csr \
            -subj "/C=US/ST=CA/L=Los Angeles/O=Localhost Certificates/CN=localhost.local"
        openssl x509 -req -sha256 -days 365 -in ./dev-certs/localhost.csr \
            -CA ./dev-certs/RootCA.pem -CAkey ./dev-certs/RootCA.key \
            -CAcreateserial -extfile ./dev-certs/dev-domains.ext \
            -out ./dev-certs/fullchain.pem
        cat ./dev-certs/RootCA.pem >> ./dev-certs/fullchain.pem
        echo "IMPORTANT: add RootCA.pem and fullchain.pem to your trusted certificates"
    fi
else
    echo "Certificate environment: production"
    # Run certbot with parameters from `command` in docker-compose
    certbot "$@"
    # Apply permissions for nginx to read certificates
    chown -R ${NGINX_UID}:${NGINX_GID} /etc/letsencrypt/live/${APP_DOMAIN}
    chown -R ${NGINX_UID}:${NGINX_GID} /etc/letsencrypt/archive/${APP_DOMAIN}
fi