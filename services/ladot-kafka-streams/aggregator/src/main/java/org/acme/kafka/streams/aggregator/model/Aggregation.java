package org.acme.kafka.streams.aggregator.model;

import java.math.BigInteger;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Aggregation {

    public String address;
    public String meter_id;
    public String latitude;
    public String longitude;
    public String status_text;
    public BigInteger timestamp;

    public Aggregation () {}
    
    public Aggregation (
        String address,
        String meter_id,
        String status_text,
        BigInteger timestamp,
        String latitude,
        String longitude
    ) {
        this.address = address;
        this.meter_id = meter_id;
        this.status_text = status_text;
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Aggregation updateFrom(Aggregation a) {
        this.address = a.address;
        this.meter_id = a.meter_id;
        this.status_text = a.status_text;
        this.timestamp = a.timestamp;
        this.latitude = a.latitude;
        this.longitude = a.longitude;

        return this;
    }
}
