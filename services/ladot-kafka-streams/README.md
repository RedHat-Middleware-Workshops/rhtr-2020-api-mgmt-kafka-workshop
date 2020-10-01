# Quarkus Kafka Streams

This project illustrates how you can build [Apache Kafka Streams](https://kafka.apache.org/documentation/streams) applications using Quarkus.

## Anatomy

This repository contains two applications:

* *aggregator*, running KStreams to join two topics.
* *producer*, places data on topics as an example, or for development.

## Building

To build the _producer_ and _aggregator_ applications, run:

```bash
mvn clean install
```

## Running

A Docker Compose file is provided for running all the components.

Start all containers by running:

```bash
docker-compose up -d --build
```

Now run an instance of the _debezium/tooling_ image which comes with several useful tools such as _kafkacat_ and _httpie_:

```bash
docker run --tty --rm -i --network ks debezium/tooling:1.0
```

In the tooling container, run _kafkacat_ to examine the results of the streaming pipeline:

```bash
kafkacat -b kafka:9092 -C -o beginning -q \
        -t temperatures-aggregated
```

You also can obtain the current aggregated state for a given weather station using _httpie_,
which will invoke an Kafka Streams interactive query for that value:

```bash
http aggregator:8080/weather-stations/data/1
```

## Running as Native Binaries

To run the _producer_ and _aggregator_ applications as native binaries via GraalVM,
first run the Maven builds using the `native` profile:

```bash
mvn clean install -Pnative -Dnative-image.container-runtime=docker
```

Then create an environment variable named `QUARKUS_MODE` and with value set to "native":

```bash
export QUARKUS_MODE=native
```

Now start Docker Compose as described above.

## Running Locally

For development purposes it can be handy to run the _producer_ and _aggregator_ applications
directly on your local machine instead of via Docker.

For that purpose, a separate Docker Compose file is provided which just starts Apache Kafka and ZooKeeper,
configured to be accessible from your host system:

```bash
# If not present yet:
# export HOSTNAME=<your hostname>

docker-compose -f docker-compose-local.yaml up

mvn quarkus:dev -f producer/pom.xml

mvn quarkus:dev -Dquarkus.http.port=8081 -f aggregator/pom.xml
```

## Database/Debezium CDC Event Models

### Meter Info (from meter table)

```json
{
  "schema": {
    "type": "struct",
    "fields": [
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "id"
          },
          {
            "type": "string",
            "optional": false,
            "field": "address"
          },
          {
            "type": "string",
            "optional": false,
            "field": "latitude"
          },
          {
            "type": "string",
            "optional": false,
            "field": "longitude"
          }
        ],
        "optional": true,
        "name": "city_info.updates.public.meter.Value",
        "field": "before"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "id"
          },
          {
            "type": "string",
            "optional": false,
            "field": "address"
          },
          {
            "type": "string",
            "optional": false,
            "field": "latitude"
          },
          {
            "type": "string",
            "optional": false,
            "field": "longitude"
          }
        ],
        "optional": true,
        "name": "city_info.updates.public.meter.Value",
        "field": "after"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "version"
          },
          {
            "type": "string",
            "optional": false,
            "field": "connector"
          },
          {
            "type": "string",
            "optional": false,
            "field": "name"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "ts_ms"
          },
          {
            "type": "string",
            "optional": true,
            "name": "io.debezium.data.Enum",
            "version": 1,
            "parameters": {
              "allowed": "true,last,false"
            },
            "default": "false",
            "field": "snapshot"
          },
          {
            "type": "string",
            "optional": false,
            "field": "db"
          },
          {
            "type": "string",
            "optional": false,
            "field": "schema"
          },
          {
            "type": "string",
            "optional": false,
            "field": "table"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "txId"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "lsn"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "xmin"
          }
        ],
        "optional": false,
        "name": "io.debezium.connector.postgresql.Source",
        "field": "source"
      },
      {
        "type": "string",
        "optional": false,
        "field": "op"
      },
      {
        "type": "int64",
        "optional": true,
        "field": "ts_ms"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "id"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "total_order"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "data_collection_order"
          }
        ],
        "optional": true,
        "field": "transaction"
      }
    ],
    "optional": false,
    "name": "city_info.updates.public.meter.Envelope"
  },
  "payload": {
    "before": null,
    "after": {
      "id": "V2MVPaW35SsOlPevs_uEP",
      "address": "1700 S MAPLE AVE",
      "latitude": "34.030464",
      "longitude": "-118.26045"
    },
    "source": {
      "version": "1.2.4.Final",
      "connector": "postgresql",
      "name": "city-info.updates",
      "ts_ms": 1601387030278,
      "snapshot": "true",
      "db": "city-info",
      "schema": "public",
      "table": "meter",
      "txId": 504,
      "lsn": 30207128,
      "xmin": null
    },
    "op": "r",
    "ts_ms": 1601387030278,
    "transaction": null
  }
}
```

### Meter Update (from meter_update table)
```json
{
  "schema": {
    "type": "struct",
    "fields": [
      {
        "type": "struct",
        "fields": [
          {
            "type": "int32",
            "optional": false,
            "field": "id"
          },
          {
            "type": "string",
            "optional": false,
            "field": "meter_id"
          },
          {
            "type": "int64",
            "optional": false,
            "name": "io.debezium.time.MicroTimestamp",
            "version": 1,
            "field": "timestamp"
          },
          {
            "type": "string",
            "optional": false,
            "field": "status_text"
          }
        ],
        "optional": true,
        "name": "city_info.updates.public.meter_update.Value",
        "field": "before"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "int32",
            "optional": false,
            "field": "id"
          },
          {
            "type": "string",
            "optional": false,
            "field": "meter_id"
          },
          {
            "type": "int64",
            "optional": false,
            "name": "io.debezium.time.MicroTimestamp",
            "version": 1,
            "field": "timestamp"
          },
          {
            "type": "string",
            "optional": false,
            "field": "status_text"
          }
        ],
        "optional": true,
        "name": "city_info.updates.public.meter_update.Value",
        "field": "after"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "version"
          },
          {
            "type": "string",
            "optional": false,
            "field": "connector"
          },
          {
            "type": "string",
            "optional": false,
            "field": "name"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "ts_ms"
          },
          {
            "type": "string",
            "optional": true,
            "name": "io.debezium.data.Enum",
            "version": 1,
            "parameters": {
              "allowed": "true,last,false"
            },
            "default": "false",
            "field": "snapshot"
          },
          {
            "type": "string",
            "optional": false,
            "field": "db"
          },
          {
            "type": "string",
            "optional": false,
            "field": "schema"
          },
          {
            "type": "string",
            "optional": false,
            "field": "table"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "txId"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "lsn"
          },
          {
            "type": "int64",
            "optional": true,
            "field": "xmin"
          }
        ],
        "optional": false,
        "name": "io.debezium.connector.postgresql.Source",
        "field": "source"
      },
      {
        "type": "string",
        "optional": false,
        "field": "op"
      },
      {
        "type": "int64",
        "optional": true,
        "field": "ts_ms"
      },
      {
        "type": "struct",
        "fields": [
          {
            "type": "string",
            "optional": false,
            "field": "id"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "total_order"
          },
          {
            "type": "int64",
            "optional": false,
            "field": "data_collection_order"
          }
        ],
        "optional": true,
        "field": "transaction"
      }
    ],
    "optional": false,
    "name": "city_info.updates.public.meter_update.Envelope"
  },
  "payload": {
    "before": null,
    "after": {
      "id": 9,
      "meter_id": "F6PeB2XQRYG-8EN5yFcrP",
      "timestamp": 1601316823000000,
      "status_text": "unknown"
    },
    "source": {
      "version": "1.2.4.Final",
      "connector": "postgresql",
      "name": "city-info.updates",
      "ts_ms": 1601388944339,
      "snapshot": "false",
      "db": "city-info",
      "schema": "public",
      "table": "meter_update",
      "txId": 510,
      "lsn": 30217968,
      "xmin": null
    },
    "op": "c",
    "ts_ms": 1601388944561,
    "transaction": null
  }
}
```
