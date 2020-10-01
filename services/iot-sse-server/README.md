# IoT Quarkus Server Sent Events

This application provides an endpoint that exposes a stream of events from the
Meter and Junction topics.

## Kafka Cluster

First you need a Kafka cluster. You can follow the instructions from the
[Apache Kafka web site](https://kafka.apache.org/quickstart) or run
`docker-compose up` if you have docker installed on your machine.

## Configuration

Use the following environment variables:

* KAFKA_BOOTSTRAP_SERVERS (default: localhost:9092)
* METERS_TOPIC_NAME (default: hydrated-meter-events) - Topic to read meter data from
* JUNCTIONS_TOPIC_NAME (default: hydrated-junction-events) - Topic to read junction data from
* GENERATOR_METERS_ENABLED (default: false) - Set to true in dev mode to generate dummy data for topics
* GENERATOR_JUNCTIONS_ENABLED (default: false) - Set to true in dev mode to generate dummy data for topics

## Local Development

The application can be started using:

```
// If these are set to true, then dummy events will be generated.
// Tese are only only generated in dev mode
GENERATOR_METERS_ENABLED=true GENERATOR_JUNCTIONS_ENABLED=true mvn quarkus:dev
```

Then, open your browser to `http://localhost:8080/meters.html`, and you should see a JSON data.

## Deploy on OpenShift

```bash
mvn clean install
mvn clean package -Dquarkus.container-image.build=true
oc new-app --image-stream="$PROJECT_NAME/iot-sse-server:1.0-SNAPSHOT"
```

## Running in Native Mode

You can compile the application into a native binary to run in Docker using:

```bash
mvn package -Pnative -Dquarkus.native.container-build=true
docker build -f src/main/docker/Dockerfile.native -t quay.io/evanshortiss/rhtr-2020-quarkus-sse .

docker run -i --rm -p 8081:8081 quay.io/evanshortiss/rhtr-2020-quarkus-sse
```

Or to run natively on your host machine:

```bash
# Compile
mvn clean install -Pnative

# Run
./target/kafka-quickstart-1.0-SNAPSHOT-runner
```
