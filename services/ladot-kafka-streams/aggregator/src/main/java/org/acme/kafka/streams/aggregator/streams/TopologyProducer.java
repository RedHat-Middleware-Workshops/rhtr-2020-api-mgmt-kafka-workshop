package org.acme.kafka.streams.aggregator.streams;

import org.acme.kafka.streams.aggregator.model.Aggregation;
import org.acme.kafka.streams.aggregator.model.MeterInfo;
import org.acme.kafka.streams.aggregator.model.MeterUpdate;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import java.util.Collections;

import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Joined;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;

import org.jboss.logging.Logger;
import io.debezium.serde.DebeziumSerdes;
import io.quarkus.kafka.client.serialization.JsonbSerde;

@ApplicationScoped
public class TopologyProducer {

    private static final Logger LOG = Logger.getLogger(TopologyProducer.class);
    static final String METER_INFO_TOPIC = "city-info.updates.public.meter";
    static final String METER_UPDATE_TOPIC = "city-info.updates.public.meter_update";
    static final String METER_DATA_AGGREGATED_TOPIC = "hydrated-meter-events";
    static final String METER_KTABLE_TOPIC = "meter-info-ktable";

    @Produces
    public Topology buildTopology() {
        LOG.info("building topology");

        StreamsBuilder builder = new StreamsBuilder();

        Serde<MeterInfo> meterInfoSerde = DebeziumSerdes.payloadJson(MeterInfo.class);
        meterInfoSerde.configure(Collections.singletonMap("from.field", "after"), false);

        Serde<MeterUpdate> meterUpdateSerde = DebeziumSerdes.payloadJson(MeterUpdate.class);
        meterUpdateSerde.configure(Collections.singletonMap("from.field", "after"), false);
    
        JsonbSerde<Aggregation> aggregationSerde = new JsonbSerde<>(Aggregation.class);
        
        // Generate a simplified key value mapped table of meter info, i.e: "meter_id:address,lat,lng" etc
        KTable<String, MeterInfo> meters = builder.stream(METER_INFO_TOPIC, Consumed.with(Serdes.String(), meterInfoSerde))
            .map((k, v) -> {
                LOG.info("mapping meter info for key: " + v.id);
                return KeyValue.pair(v.id, v);
            })
            .through(METER_KTABLE_TOPIC, Produced.with(Serdes.String(), meterInfoSerde))
            .toTable();

        builder.stream(METER_UPDATE_TOPIC, Consumed.with(Serdes.String(), meterUpdateSerde))
            .map((k, v) -> {
                LOG.info("mapping meter update for meter:" + v.meter_id);
                return KeyValue.pair(v.meter_id, v);
            })
            .join(
                meters,
                (update, info) -> {
                    LOG.info("Joining meter_update with ID " + update.meter_id + " to meter info with ID " + info.id);

                    return new Aggregation(
                        info.address,
                        update.meter_id,
                        update.status_text,
                        update.timestamp,
                        info.latitude,
                        info.longitude
                    );
                },
                Joined.with(Serdes.String(), meterUpdateSerde, meterInfoSerde)
            )
            .to(METER_DATA_AGGREGATED_TOPIC, Produced.with(Serdes.String(), aggregationSerde));

        return builder.build();
    }
}
