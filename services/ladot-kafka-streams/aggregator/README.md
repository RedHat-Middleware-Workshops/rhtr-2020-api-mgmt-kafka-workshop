# Meter Update Aggregator

This application aggregates data produced by Debezium CDC to the
`city-info.updates.public.meter_update` and `city-info.updates.public.meter`
Kafka topics, and joins them to created hydrated events for consumers.

## Usage

## Notes

The `hydrated-meter-events` and `meter-info-ktable` Topics need to be manually
created for the application to work.

If these are not created a message will be displayed in the logs:

```
Waiting for topic(s) to be created: [hydrated-meter-events, meter-info-ktable]
```

Create the Topics using the following commands when after starting the services
using `docker-compose up --build`:

```bash
docker exec ladot-kafka-streams_kafka_1 /opt/kafka/bin/kafka-topics.sh --create --topic meter-info-ktable --zookeeper zookeeper:2181 --partitions 1 --replication-factor 1
docker exec ladot-kafka-streams_kafka_1 /opt/kafka/bin/kafka-topics.sh --create --topic hydrated-meter-events --zookeeper zookeeper:2181 --partitions 1 --replication-factor 1
```

After this you can see the `hydrated-meter-events` events. Use the following command to stream messages from the Topic:

```bash
docker exec ladot-kafka-streams_kafka_1 /opt/kafka/bin/kafka-console-consumer.sh --topic hydrated-meter-events --bootstrap-server localhost:9092
```

### Run in Quarkus Dev Mode

```bash
mvn quarkus:dev
```

### Build

```bash
mvn clean install
```

## Data Output

The joined data stream will be sent to the `meter-event-aggregated` topic.

The format of this joined data is:

```json
{
  "address": "1700 S MAPLE AVE",
  "latitude": "34.030464",
  "longitude": "-118.26045",
  "meter_id": "F6PeB2XQRYG-8EN5yFcrP",
  "status_text": "unknown",
  "timestamp": 1601551107671000
}
```
