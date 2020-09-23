# AMQ Streams version 1.5 is based on Strimzi 0.18.x. 
FROM strimzi/kafka:0.18.0-kafka-2.5.0

USER root:root
RUN mkdir -p /opt/kafka/plugins/debezium
# Download, unpack, and place the debezium-connector-postgres folder
# into the /opt/kafka/plugins/debezium directory
RUN curl -s https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/1.2.4.Final/debezium-connector-postgres-1.2.4.Final-plugin.tar.gz | tar xvz --transform 's/debezium-connector-postgres/debezium/' --directory /opt/kafka/plugins/
USER 1001