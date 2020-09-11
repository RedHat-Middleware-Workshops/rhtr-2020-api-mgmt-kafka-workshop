package org.acme.kafka;
import io.quarkus.arc.profile.IfBuildProfile;
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
@IfBuildProfile("dev")
public class MeterEventGenerator {

    @ConfigProperty(name = "generators.meters.enabled", defaultValue = "false") 
    private String enabled;

    private static final Logger LOG = Logger.getLogger(MeterEventGenerator.class);

    private Random random = new Random();

    @Outgoing("generated-meter-events")
    public Multi<String> generate() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(5))
                .onOverflow().drop()
                .map(tick -> {
                    if (this.enabled == "false") {
                        // TODO: build properties to disable the bean instead
                        return "{}";
                    }

                    LOG.info("writing generated message to topic");

                    MeterEvent m = new MeterEvent(
                        "Generated Meter",
                        "generated-uuid",
                        "generated-status(" +random.nextInt() + ")"
                    );

                    return m.toJSON();
                });
    }

}
