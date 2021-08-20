FROM alpine:latest

WORKDIR /app

COPY ./src/docker/worker/entrypoint.sh .

RUN chmod +x ./entrypoint.sh && apk add --update --no-cache netcat-openbsd

CMD [ "./entrypoint.sh" ]
