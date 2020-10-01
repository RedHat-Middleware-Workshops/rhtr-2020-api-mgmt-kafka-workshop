import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.camel.BindToRegistry;
import org.apache.camel.PropertyInject;


public class JunctionsConsumer extends RouteBuilder {

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
        log.info("About to start route: Kafka Server -> Junction Updates Table in PSQL");
    
        // Message format: { junctionId: "pSiSvQE4ID1Yp7Pfxwuc2", counts: { ns: 9, ew: 32 }, timestamp: 1600430992 }
        from("kafka:{{consumer.topic}}?brokers={{kafka.host}}:{{kafka.port}}"
                + "&maxPollRecords={{consumer.maxPollRecords}}"
                + "&consumersCount={{consumer.consumersCount}}"
                + "&seekTo={{consumer.seekTo}}"
                + "&groupId={{consumer.group}}")
                .routeId("JunctionsFromKafka")
                .unmarshal().json()
                .log("Kafka message headers: ${headers}")
                .log("Kafka message body: ${body}")
                .setBody(simple("INSERT INTO junction_update(junction_id, timestamp, count_ns, count_ew) VALUES ('${body[junctionId]}', to_timestamp(${body[timestamp]}), '${body[counts][ns]}', '${body[counts][ew]}');"))
                .log("SQL statement: ${body}")
                .to("jdbc:datasource");
    }
}
