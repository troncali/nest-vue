#!/bin/bash
set -e

# Make uuid_generate_v4() available for TypeORM

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname="$POSTGRES_DB"<<-EOSQL
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
