FROM alpine:3.16.1

WORKDIR /app

COPY ./apps/docker/src/worker/entrypoint.sh .

RUN chmod +x ./entrypoint.sh \
	&& apk add --update --no-cache netcat-openbsd tzdata

CMD [ "./entrypoint.sh" ]
