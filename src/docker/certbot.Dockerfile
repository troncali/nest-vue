FROM certbot/certbot

COPY ["./src/nginx/certbot-entrypoint.sh", "./src/nginx/dev-certs/dev-domains.ext", "./"]

RUN chmod +x certbot-entrypoint.sh

ENTRYPOINT ["./certbot-entrypoint.sh"]
