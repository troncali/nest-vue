FROM certbot/certbot:v1.22.0

COPY ["./src/docker/certbot/*", "./src/docker/nginx/dev-certs/dev-domains.ext", "./"]

RUN chmod +x entrypoint.sh deploy-hook.sh

ENTRYPOINT ["./entrypoint.sh"]
