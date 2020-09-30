package org.acme.kafka.streams.aggregator.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The following fields are sent by CDC to the "meter" topic
 * "id": "V2MVPaW35SsOlPevs_uEP",
 * "address": "1700 S MAPLE AVE",
 * "latitude": "34.030464",
 * "longitude": "-118.26045"
 */
@RegisterForReflection
public class MeterInfo {

    public String id;
    public String address;
    public String latitude;
    public String longitude;

    public MeterInfo(){
    }

    public MeterInfo(String id, String address, String latitude, String longitude){
        this.id = id;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
