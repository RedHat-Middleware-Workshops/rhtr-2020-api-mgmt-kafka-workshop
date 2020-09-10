package org.acme.kafka;

import org.jboss.logging.Logger;

import java.time.Duration;
import java.util.Random;

import javax.enterprise.context.ApplicationScoped;

import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.reactive.messaging.Outgoing;
import org.eclipse.microprofile.config.inject.ConfigProperty;


/**
 * This generator is used for testing this service. In production it should be
 * disabled using the GENERATOR_METERS_ENABLED environment variable
 */
@ApplicationScoped
public class JunctionEventGenerator {

    @ConfigProperty(name = "generators.junctions.enabled", defaultValue = "false") 
    private String enabled;

    private Random random = new Random();

    private static final Logger LOG = Logger.getLogger(JunctionEventGenerator.class);

    @Outgoing("generated-junction-events")
    public Multi<String> generate() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(5))
                .onOverflow().drop()
                .map(tick -> {
                    if (this.enabled == "false") {
                        // TODO: build properties to disable the bean instead
                        return "{}";
                    }

                    LOG.info("writing generated message to topic");

                    JunctionEvent m = new JunctionEvent(
                        "Generated Junction",
                        "generated-uuid",
                        random.nextInt(),
                        random.nextInt()
                    );

                    return m.toJSON();
                });
    }

}
