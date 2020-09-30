package org.acme.kafka.streams.aggregator.model;

import java.math.BigInteger;
import io.quarkus.runtime.annotations.RegisterForReflection;


/**
 * The following fields are sent by CDC to the "meter_update" topic
 * "meter_id": "V2MVPaW35SsOlPevs_uEP",
 * "id": 9,
 * "timestamp": 1601316823000000,
 * "status_text": "unknown"
 */
@RegisterForReflection
public class MeterUpdate {

    public int id;
    public BigInteger timestamp;
    public String meter_id;
    public String status_text;

    public MeterUpdate(){
    }

    public MeterUpdate(int id, BigInteger timestamp, String meter_id, String status_text){
        this.id = id;
        this.timestamp = timestamp;
        this.meter_id = meter_id;
        this.status_text = status_text;
    }
}