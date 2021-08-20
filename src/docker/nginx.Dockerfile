FROM nginx:alpine

WORKDIR /etc/nginx

ARG NGINX_DH_BITS
ARG NGINX_GID
ARG NGINX_UID

# Configurations: use templates for variable interpolation (requires nginx@^1.19)
COPY ./src/docker/nginx/confs/nginx.conf ./templates/nginx.conf.template
COPY ./src/docker/nginx/confs/certbot.conf ./templates/certbot.conf.template

# Configuration scripts to run before each nginx start
COPY ./src/docker/nginx/scripts ./docker-entrypoint.d

# Frontend and static files
COPY ./builds/frontend ./html

RUN chmod +x ./docker-entrypoint.d/*.sh \
	# Generate dhparam on first image build; cached for future builds
    && mkdir /etc/nginx/certs && apk add openssl \
    && echo "Generating DH parameters (dhparam-${NGINX_DH_BITS}.pem) for SSL configuration:" \
    && echo "${NGINX_DH_BITS} bit long safe prime (takes some time)" \
    && openssl dhparam -out /etc/nginx/certs/dhparam-${NGINX_DH_BITS}.pem ${NGINX_DH_BITS} 2>/dev/null \
	# Set non-root user permissions on required folders
    && chown -R ${NGINX_UID}:${NGINX_GID} /etc/nginx \
	&& chown -R ${NGINX_UID}:${NGINX_GID} /var/cache/nginx \
    && chown -R ${NGINX_UID}:${NGINX_GID} /var/log/nginx \
    && touch /tmp/nginx.pid && touch /tmp/nginx-temp.pid \
	&& mkdir /tmp/proxy_temp && mkdir /tmp/client_temp \
	&& mkdir /tmp/fastcgi_temp && mkdir /tmp/uwsgi_temp \
	&& mkdir /tmp/scgi_temp && chown -R ${NGINX_UID}:${NGINX_GID} /tmp

# Run nginx as non-root user
USER ${NGINX_UID}:${NGINX_GID}

CMD ["nginx", "-g", "daemon off;"]

# TODO: use bunkerized-nginx, or integrate some features? Performance tradeoff?
