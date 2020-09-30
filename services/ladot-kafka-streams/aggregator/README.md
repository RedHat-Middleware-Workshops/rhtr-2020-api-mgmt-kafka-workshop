# Meter Update Aggregator

This application aggregates data produced by Debezium CDC to the
`city-info.updates.public.meter_update` and `city-info.updates.public.meter`
Kafka topics, and joins them to created hydrated events for consumers.

## Usage

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
  "timestamp": 1601316823000000
}
```
