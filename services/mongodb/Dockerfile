FROM mongo:3.6

ENV MONGO_INITDB_ROOT_USERNAME "root"
ENV MONGO_INITDB_ROOT_PASSWORD "password"
ENV MONGO_INITDB_DATABASE "city-info"
ENV MONGO_DATA_DIR "/data/db"

# Data files for base data
COPY junction_info.json /docker-entrypoint-initdb.d/junction_info.json
COPY meter_info.json /docker-entrypoint-initdb.d/meter_info.json

# Init script to pull in data
COPY configure-db.sh /docker-entrypoint-initdb.d/configure-db.sh
RUN chmod +x /docker-entrypoint-initdb.d/configure-db.sh

RUN useradd someuser -u 1001 -G root
RUN chown -R 1001:0 /data/db

USER 1001

CMD [ "mongod", "--replSet", "rs0", "--auth" ]