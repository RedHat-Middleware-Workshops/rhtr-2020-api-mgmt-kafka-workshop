FROM debezium/postgres:12-alpine

ENV POSTGRES_DB "city-info"
ENV POSTGRES_USER "rhtr-user"
ENV POSTGRES_PASSWORD "rhtr-pass"
ENV PGDATA "/data/data"

# These are used by the script below to import data
COPY junction_info.csv /docker-entrypoint-initdb.d/junction_info.csv
COPY meter_info.csv /docker-entrypoint-initdb.d/meter_info.csv

# This file is automatically run on startup to create tables and import data 
COPY rhtr-setup.sql /docker-entrypoint-initdb.d/rhtr-setup.sql