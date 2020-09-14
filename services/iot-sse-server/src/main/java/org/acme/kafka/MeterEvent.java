package org.acme.kafka;

import io.vertx.core.json.JsonObject;

public class MeterEvent {

    public String address;
    public String uuid;
    public String status;
    public String ts;

    public MeterEvent() {}

    public MeterEvent(String address, String uuid, String status, String ts) {
        this.address = address;
        this.uuid = uuid;
        this.status = status;
        this.ts = ts;
    }

    public String toJSON() {
        JsonObject json = new JsonObject();

        json.put("uuid", this.uuid);
        json.put("status", this.status);
        json.put("address", this.address);
        json.put("ts", this.ts);

        return json.encode();
    }
}