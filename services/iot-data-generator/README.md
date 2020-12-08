# RHTR 2020 Lab IoT Data Generator

## What it does

Simulates the IoT sensor network for the lab. Each sensor will occasionally
send out a JSON payload with containing its state.

## Simulation Specifics

1. On a defined interval (every 2.5 seconds by default) and "update" function is triggered.
1. This updates the state of a randomly selected parking meter.
1. The new state is flushed to a **[transport]**. This is chosen via the `TRANSPORT_MODE` environment variable.

## Requirements

* Node.js v12
* Docker Community v19
* OpenShift 4.5

## Configuration via Environment Variables

The default values for these variables can be found in *lib/config.js*.

* `TRANSPORT_MODE`: Determines where IoT data is written to. Set to `kafka`, `http`, or `console`.
* `HTTP_PORT`: Port the HTTP server listens on.
* `KAFKA_HOST`: Kafka broker(s) connection string.
* `BRIDGE_HTTP_HOST`: Required if `TRANSPORT_MODE=http`.
* `SEND_INTERVAL_MS`: Number of milliseconds to wait between "ticks" for sending updates.
* `SEND_COUNT_MIN`: Minimum number of updates to send for a given tick.
* `SEND_COUNT_MAX`: Maximum number of updates to send for a given tick.

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
export TAGNAME=rhtr-2020-iot-datagen

# Note: the --build-arg flags are only required if using a custom npm registry
docker build \
--build-arg NPM_REGISTRY_URL=$REG_URL \
--build-arg NPM_CAFILE_URL=$REG_CA_URL \
. -t quay.io/evanshortiss/rhtr-2020-iot-datagen

docker run quay.io/evanshortiss/rhtr-2020-iot-datagen
```
