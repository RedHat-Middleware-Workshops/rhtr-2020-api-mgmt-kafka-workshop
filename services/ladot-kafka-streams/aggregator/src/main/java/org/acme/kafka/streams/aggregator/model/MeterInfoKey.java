package org.acme.kafka.streams.aggregator.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The key from a Debezium event for meter info is a JSON object
 * with an "id" String in the payload, e.g "F6PeB2XQRYG-8EN5yFcrP"
 */
@RegisterForReflection
public class MeterInfoKey {

    public String id;

    public MeterInfoKey(){
    }

    public MeterInfoKey(String id) {
        this.id = id;
    }
}
