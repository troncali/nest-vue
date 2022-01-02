FROM postgres:14.1-alpine3.15

# Configuration scripts to run for initial db startup
COPY ./src/docker/db /docker-entrypoint-initdb.d

RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# TODO: harden postgres security - see PostgreSQL Resources 1-2
