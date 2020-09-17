\connect "city-info"

CREATE TABLE junction (
   id text NOT NULL PRIMARY KEY,
   name text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

CREATE TABLE meter (
   id text NOT NULL PRIMARY KEY,
   address text NOT NULL,
   latitude real NOT NULL,
   longitude real NOT NULL
);

COPY junction(id,name,latitude,longitude) FROM '/docker-entrypoint-initdb.d/junction_info.csv' DELIMITER ',' CSV HEADER;
COPY meter(id,address,latitude,longitude) FROM '/docker-entrypoint-initdb.d/meter_info.csv' DELIMITER ',' CSV HEADER;
