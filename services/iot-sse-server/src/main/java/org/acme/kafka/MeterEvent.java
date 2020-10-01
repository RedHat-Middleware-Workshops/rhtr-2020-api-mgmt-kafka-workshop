package org.acme.kafka;

import io.vertx.core.json.JsonObject;

public class MeterEvent {

    public String address;
    public String meter_id;
    public String status_text;
    public String latitude;
    public String longitude;
    public Long timestamp;

    public MeterEvent() {}

    public MeterEvent(String address, String meter_id, String status_text, String latitude, String longitude, Long timestamp) {
        this.address = address;
        this.meter_id = meter_id;
        this.status_text = status_text;
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String toJSON() {
        JsonObject json = new JsonObject();

        json.put("meter_id", this.meter_id);
        json.put("status_text", this.status_text);
        json.put("address", this.address);
        json.put("timestamp", this.timestamp);
        json.put("latitude", this.latitude);
        json.put("longitude", this.longitude);

        return json.encode();
    }
}