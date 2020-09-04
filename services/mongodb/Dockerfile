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

RUN chgrp -R root /data/db && chmod -R g=u /data/db

CMD [ "mongod", "--replSet", "rs0", "--auth" ]