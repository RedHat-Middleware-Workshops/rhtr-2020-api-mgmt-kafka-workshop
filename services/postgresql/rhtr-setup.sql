\connect "city-info"

CREATE TABLE junction (
   uuid text NOT NULL PRIMARY KEY,
   junction_name text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

CREATE TABLE meter (
   uuid text NOT NULL PRIMARY KEY,
   address text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

COPY junction(uuid,junction_name,latitude,longitude) FROM '/docker-entrypoint-initdb.d/junction_info.csv' DELIMITER ',' CSV HEADER;
COPY meter(uuid,address,latitude,longitude) FROM '/docker-entrypoint-initdb.d/meter_info.csv' DELIMITER ',' CSV HEADER;
