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

CREATE TABLE meter_update (
   id serial PRIMARY KEY,
   meter_id text NOT NULL references meter(id),
   timestamp TIMESTAMP NOT NULL,
   status_text text NOT NULL
);

CREATE TABLE junction_update (
   id serial PRIMARY KEY,
   junction_id text NOT NULL references junction(id),
   timestamp TIMESTAMP NOT NULL,
   count_ns int NOT NULL,
   count_ew int NOT NULL
);

COPY junction(id,name,latitude,longitude) FROM '/docker-entrypoint-initdb.d/junction_info.csv' DELIMITER ',' CSV HEADER;
COPY meter(id,address,latitude,longitude) FROM '/docker-entrypoint-initdb.d/meter_info.csv' DELIMITER ',' CSV HEADER;
