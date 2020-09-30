package org.acme.kafka.streams.aggregator.streams;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import java.util.Collections;

import org.acme.kafka.streams.aggregator.model.MeterInfo;
import org.acme.kafka.streams.aggregator.model.MeterUpdate;
import org.acme.kafka.streams.aggregator.model.Aggregation;

import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
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
    static final String METER_DATA_AGGREGATED_TOPIC = "meter-event-aggregated";

    @Produces
    public Topology buildTopology() {
        StreamsBuilder builder = new StreamsBuilder();

        Serde<MeterInfo> meterInfoSerde = DebeziumSerdes.payloadJson(MeterInfo.class);
        meterInfoSerde.configure(Collections.singletonMap("from.field", "after"), false);

        Serde<MeterUpdate> meterUpdateSerde = DebeziumSerdes.payloadJson(MeterUpdate.class);
        meterUpdateSerde.configure(Collections.singletonMap("from.field", "after"), false);

        JsonbSerde<Aggregation> aggregationSerde = new JsonbSerde<>(Aggregation.class);

        KTable<String, MeterInfo> meters = builder.table(METER_INFO_TOPIC, Consumed.with(Serdes.String(), meterInfoSerde));
        
        builder.stream(METER_UPDATE_TOPIC, Consumed.with(Serdes.String(), meterUpdateSerde))
                .join(
                    meters,
                    (v1, v2) -> {
                        LOG.info("Joining meter_update with ID " + v1.meter_id + " to meter info with ID " + v2.id);
                        return new Aggregation(
                            v2.address,
                            v1.meter_id,
                            v1.status_text,
                            v1.timestamp,
                            v2.latitude,
                            v2.longitude
                        );
                    }
                )
                .to(METER_DATA_AGGREGATED_TOPIC, Produced.with(Serdes.String(), aggregationSerde));

        return builder.build();
    }
}
