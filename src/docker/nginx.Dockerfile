FROM nginx:1.21.5-alpine

WORKDIR /etc/nginx

ARG NGINX_DH_BITS
ARG NGINX_GID
ARG NGINX_UID

# Configurations: use templates for variable interpolation (requires nginx@^1.19)
COPY ./src/docker/nginx/confs ./templates

# Configuration scripts to run before each nginx start
COPY ./src/docker/nginx/scripts /docker-entrypoint.d

RUN chmod +x /docker-entrypoint.d/*.sh \
	# Add .template extension to all .conf files for variable interpolation
	&& for f in ./templates/*.conf; do mv -- "$f" "${f}.template"; done \
	# Generate dhparam on first image build; cached for future builds
    && mkdir /var/certs && apk add openssl \
    && echo "Generating DH parameters (dhparam-${NGINX_DH_BITS}.pem) for SSL configuration:" \
    && echo "${NGINX_DH_BITS} bit long safe prime (takes some time)" \
    && openssl dhparam -out /var/certs/dhparam-${NGINX_DH_BITS}.pem ${NGINX_DH_BITS} 2>/dev/null \
	# For read only support, write interpolated .conf files to /tmp/conf but read from ./confs
	&& mkdir /tmp/confs && rm /etc/nginx/nginx.conf \
	&& ln -s /etc/nginx/confs/nginx.conf /etc/nginx/nginx.conf \
	# Set non-root user permissions on required folders
	&& chown -R ${NGINX_UID}:${NGINX_GID} /etc/nginx \
    && touch /tmp/nginx.pid && touch /tmp/nginx-temp.pid \
	&& touch /tmp/error.log && touch /tmp/access.log \
	&& mkdir /tmp/proxy_temp && mkdir /tmp/client_temp \
	&& mkdir /tmp/fastcgi_temp && mkdir /tmp/uwsgi_temp \
	&& mkdir /tmp/scgi_temp && chown -R ${NGINX_UID}:${NGINX_GID} /tmp /opt

# Run nginx as non-root user
USER ${NGINX_UID}:${NGINX_GID}

CMD ["nginx", "-g", "daemon off;"]
