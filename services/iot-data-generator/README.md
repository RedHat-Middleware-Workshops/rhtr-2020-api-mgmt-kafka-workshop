# RHTR 2020 Lab IoT Data Generator

## What it does

* Seeds the backing IoT MongoDB instance with data.
* Simulates the IoT sensor network for the lab.

## Simulation Specifics

1. Once per minute an "update" function is executed.
1. This updates the state of each parking meter and junction.
1. The new state is flushed to a **[transport]**. This is defined via environment variables.

Currently this generates a large volume of data. We can revise this strategy to
control the flow/frequency of updates.

Configure this by setting a `TRANSPORT_MODE` environment variable.

## Requirements

* Node.js v12
* Docker Community v19
* OpenShift 4.5

## Configuration via Environment Variables

The default values for these variables can be found in *lib/config.js*.

* `TRANSPORT_MODE`: Determines where IoT data is written to. Set to `kafka` or `console`.
* `HTTP_PORT`: Port the HTTP server listens on.
* `KAFKA_HOST`: Kafka broker(s) connection string.
* `MONGO_CONNECTION_STRING`: Connection string for MongoDB.

## Run Locally with Node.js

Run the following from this directory (the one containing a *package.json*):

```bash
npm install
npm run dev
```

The generator will begin to print data on the console by default.

## Deploy to OpenShift
Running the following will deploy the project into the `city-of-losangeles`
namespace.

```bash
oc login $CLUSTER_HOST -u admin
npm install
npm run nodeshift
```

## Docker Build & Run

The npm registry variables passed in the example are optional.

```bash
export TAGNAME=rhtr-2020-kafka-amp-iot-datagen

# Note: the --build-arg flags are only required if using a custom npm registry
docker build \
--build-arg NPM_REGISTRY_URL=$REG_URL \
--build-arg NPM_CAFILE_URL=$REG_CA_URL \
. -t rhtr-2020-kafka-amp-iot-datagen

docker run rhtr-2020-kafka-amp-iot-datagen:latest
```
