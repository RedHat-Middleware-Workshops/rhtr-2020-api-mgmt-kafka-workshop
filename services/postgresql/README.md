# PostgreSQL

The database service used in the lab. Contains reference data, i.e the meter
and junction IDs, GPS co-ordinates, and address information.

## Build

```bash
docker build . -t quay.io/evanshortiss/rhtr-2020-pgsql
```

## Run, Connect, and Test

First, start this PostgreSQL container image:

```bash
export RHTR_CONTAINER_NAME="rhtr-pgsql"

docker run --name $RHTR_CONTAINER_NAME quay.io/evanshortiss/rhtr-2020-pgsql
```

Next, connect to it and run some queries:

```bash
export CLIENT_CONTAINER_NAME="pgexec"

# The username and password must be set to start the container
docker run -dit --link $RHTR_CONTAINER_NAME \
-e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user \
--name $CLIENT_CONTAINER_NAME postgres:12-alpine

# Start a shell in the client psql container
docker exec -it $CLIENT_CONTAINER_NAME /bin/bash

# Connect to the RHTR PostgreSQL instance using the default username
# Enter the password "rhtr-pass" when prompted, then issue a test query
> psql -d city-info -h rhtr-pgsql -U rhtr-user -W
Password:
psql (12.4)
Type "help" for help.

city-info=# select * from junction_info;
```
