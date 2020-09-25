# IoT Data Ingestion Camel Service

## Prerequisites

* Create a project per the steps in the root [README.md](/README.md).
* Install the *Red Hat Integration - Camel K* Operator.
* Run `oc apply -f integration.platform.yaml`.
* Set the `TRANSPORT_MODE=kafka` in the environment on the `iot-data-generator` deployment.
* Install Kamel CLI (https://camel.apache.org/camel-k/latest/cli/cli.html)

## Run the Integrations

```bash
oc create configmap meters.kafka.props  --from-file=meters.properties

kamel run MetersConsumer.java \
--configmap=meters.kafka.props \
--secret pg-login \
--dependency mvn:org.postgresql:postgresql:42.2.10 \
--dependency=camel-jdbc \
--dependency=mvn:org.apache.commons:commons-dbcp2:2.7.0

oc create configmap meters.kafka.props  --from-file=junction.properties

kamel run JunctionsConsumer.java \
--configmap=junction.kafka.props \
--secret pg-login \
--dependency mvn:org.postgresql:postgresql:42.2.10 \
--dependency=camel-jdbc \
--dependency=mvn:org.apache.commons:commons-dbcp2:2.7.0
```
