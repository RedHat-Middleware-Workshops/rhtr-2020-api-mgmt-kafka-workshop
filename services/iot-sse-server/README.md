# IoT Quarkus Server Sent Events

This application provides an endpoint that exposes a stream of events from the
Meter and Junction topics.

## Kafka cluster

First you need a Kafka cluster. You can follow the instructions from the
[Apache Kafka web site](https://kafka.apache.org/quickstart) or run
`docker-compose up` if you have docker installed on your machine.

## Start the Application

The application can be started using:

```bash
GENERATOR_METERS_ENABLED=true GENERATOR_JUNCTIONS_ENABLED=true mvn quarkus:dev
```

Then, open your browser to `http://localhost:8080/meters.html`, and you should see a JSON data.


## Running in native

You can compile the application into a native binary using:

`mvn clean install -Pnative`

and run with:

`./target/kafka-quickstart-1.0-SNAPSHOT-runner`
