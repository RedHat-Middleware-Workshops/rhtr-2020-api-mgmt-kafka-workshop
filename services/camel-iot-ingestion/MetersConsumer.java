import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.camel.BindToRegistry;
import org.apache.camel.PropertyInject;


public class MetersConsumer extends RouteBuilder {

    @BindToRegistry("dataSource")
    public BasicDataSource datasoure(@PropertyInject("db.username") String username, @PropertyInject("db.password") String password) {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl("jdbc:postgresql://iot-psql:5432/city-info");
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Override
    public void configure() throws Exception {
        log.info("About to start route: Kafka Server -> Meter Updates Table in PSQL");
    
        // Message format: {"meterId":"pSiSvQE4ID1Yp7Pfxwuc2","timestamp":1600430992,"status":"occupied"}
        from("kafka:{{consumer.topic}}?brokers={{kafka.host}}:{{kafka.port}}"
                + "&maxPollRecords={{consumer.maxPollRecords}}"
                + "&consumersCount={{consumer.consumersCount}}"
                + "&seekTo={{consumer.seekTo}}"
                + "&groupId={{consumer.group}}")
                .routeId("MetersFromKafka")
                .unmarshal().json()
                .log("Kafka message headers: ${headers}")
                .log("Kafka message body: ${body}")
                .setBody(simple("INSERT INTO meter_update(meter_id, timestamp, status_text) VALUES ('${body[meterId]}', to_timestamp(${body[timestamp]}), '${body[status]}');"))
                .log("SQL statement: ${body}")
                .to("jdbc:datasource");
    }
}
