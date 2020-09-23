# AMQ Streams (Kafka/Strimzi) Services

Set of CRDs that define Kafka Cluster, Kafka Connect, Kafka Topics, and Kafka
Connectors for CDC.

## Usage

* Install the AMQ Streams v1.5.3 operator
* Create the Kafka Cluster: `oc apply -f kafka.cluster.yml`
* Create a Kafka Connect and Connector: `oc apply -f kafka.connect.yml && oc apply -f kafka.connector.yml`
* Create Kafka Topics for data ingestion `oc apply -f kafka.topic.meters.yml && oc apply -f kafka.topic.junctions.yml`

## Build the Kafka Connect Plugins Image

An image is required to load the PostgreSQL Debezium Connector for Kafka
Connect. Check the *kafka.connect.yml* file to see where it's loaded.

```bash
docker build . -t quay.io/evanshortiss/rhtr-2020-kafka-connect-pgsql
docker push quay.io/evanshortiss/rhtr-2020-kafka-connect-pgsql
```

## Topics

* junctions - Contains inbound Junction updates from IoT enabled traffic intersections.
* meters - Contains inbound Meter updates IoT enabled parking meters.
