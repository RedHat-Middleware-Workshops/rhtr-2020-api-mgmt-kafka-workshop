package org.acme.kafka;

import io.vertx.core.json.JsonObject;

public class JunctionEvent {

    public String name;
    public String uuid;
    public int ns;
    public int ew;

    public JunctionEvent() {}

    public JunctionEvent(String name, String uuid, int ns, int ew) {
        this.name = name;
        this.uuid = uuid;
        this.ns = ns;
        this.ew = ew;
    }

    public String toJSON() {
        JsonObject json = new JsonObject();

        json.put("uuid", this.uuid);
        json.put("ns", this.ns);
        json.put("ew", this.ew);
        json.put("name", this.name);

        return json.encode();
    }
}