# Target a small image size (but uses `musl libc` instead of `glibc`; use 
# `nginx:latest` if `glibc` is required)
FROM nginx:alpine

WORKDIR /etc/nginx

ARG NGINX_DH_BITS

RUN chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid \
    # Generate dhparam on first image build; cached for future builds
    && mkdir /etc/nginx/certs && apk add openssl \
    && echo "Generating DH parameters (dhparam-${NGINX_DH_BITS}.pem) for SSL configuration:" \
    && echo "${NGINX_DH_BITS} bit long safe prime (takes some time)" \
    && openssl dhparam -out /etc/nginx/certs/dhparam-${NGINX_DH_BITS}.pem ${NGINX_DH_BITS} 2>/dev/null \
    && chown -R nginx:nginx /etc/nginx

USER nginx

# NGINX configuration: use template for variable interpolation (requires nginx@^1.19)
COPY --chown=nginx:nginx ./src/nginx/nginx.conf ./templates/nginx.conf.template

# Serve frontend and static files
COPY --chown=nginx:nginx ./public ./html