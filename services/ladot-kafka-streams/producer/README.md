# Meter Update Producer

This is used to simulate update events that Debezium captures from the
`meter_update` and `meter` tables Postgres.

It sends fixed JSON payloads to the `city-info.updates.public.meter_update` and
`city-info.updates.public.meter` Kafka topics.

The events created by this producer are consumed by the *aggregator* project.

## Usage

### Run in Quarkus Dev Mode

```bash
mvn quarkus:dev
```

### Build

```bash
mvn clean install
```
