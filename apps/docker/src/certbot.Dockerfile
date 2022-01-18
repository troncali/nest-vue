FROM certbot/certbot:v1.22.0

COPY ["./apps/docker/src/certbot/*", "./apps/docker/src/nginx/dev-certs/dev-domains.ext", "./"]

RUN chmod +x entrypoint.sh deploy-hook.sh

ENTRYPOINT ["./entrypoint.sh"]
