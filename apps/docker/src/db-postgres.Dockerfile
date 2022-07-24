FROM postgres:14.4-alpine3.16

# Configuration scripts to run for initial db startup
COPY ./apps/docker/src/db /docker-entrypoint-initdb.d

RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# TODO: harden postgres security - see PostgreSQL Resources 1-2
