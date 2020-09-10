package org.acme.kafka;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.resteasy.annotations.SseElementType;
import org.reactivestreams.Publisher;

import org.eclipse.microprofile.reactive.messaging.Channel;

@Path("/junctions")
public class JunctionEventResource {

    @Inject
    @Channel("junction-events")
    Publisher<JunctionEvent> junctionEvents;

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @SseElementType("text/json")
    public Publisher<JunctionEvent> stream() {
        return junctionEvents;
    }
}
