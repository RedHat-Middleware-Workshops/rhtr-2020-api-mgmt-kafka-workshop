# RHTR 2020 Kafka and API Management IoT Lab

## Local Development & Deployment

Refer to the [services README](/services).

## Deployment for Demo on OpenShift

This assumes that everything is deployed into the `city-of-losangeles` project
namespace.

Requires an OpenShift 4.4 or later cluster with the CamelK and AMQ Streams
operators installed for all namespaces, and using the CamelK Client 1.5.0
CLI.

This will create the initial project architecture:

```bash
# Generate project.yml from individual definitions in each service
./scripts/generate.complete.project.sh

# Create a project namespace and apply the project.yml resources
oc new-project city-of-losangeles
oc apply -f project.complete.yml
```

Next, deploy the Java-based Kafka Streams application:

```bash
cd services/ladot-kafka-streams/aggregator/
mvn clean package -Dquarkus.container-image.build=true

oc new-app --image-stream city-of-losangeles/ladot-cdc-aggregator:1.0-SNAPSHOT \
-e KAFKA_BOOTSTRAP_SERVERS=iot-cluster-kafka-brokers:9092
```

Deploy the CamelK service that processes incoming Meter update payloads:

```bash
cd services/camel-iot-ingestion

oc create configmap meters.kafka.props --from-file=meters.properties

kamel run MetersConsumer.java \
--secret pg-login \
--configmap=meters.kafka.props \
--dependency mvn:org.postgresql:postgresql:42.2.10 \
--dependency=camel-jdbc \
--dependency=mvn:org.apache.commons:commons-dbcp2:2.7.0
```

Wait for the **meters-consumer** deployment to become ready:

```
oc get deployments meters-consumer -w
```

Once the **meters-consumer** is ready, scale the **iot-data-generator** up to
1 Pod and data will flow through the system. You can see the data in realtime
by opening the **mobile-app** route and selecting the Meters tab in the UI.


## Deploying the Lab AgnosticD Workload

```bash
# These will vary based on your opentlc ID and provisioned cluster details
export OCP_USERNAME=username-redhat.com
export GUID="1001"
export TARGET_HOST="bastion.$GUID.example.opentlc.com"
export APPS_DOMAIN="apps.cluster-$GUID.$GUID.example.opentlc.com"

# Always use this value since it's the workload name
export WORKLOAD="ocp4-workload-iot-managed"

# Change this depending on lab size
export USER_COUNT=5

# Copy SSH key to authorised keys on the bastion
ssh-copy-id $OCP_USERNAME@bastion.$GUID.example.opentlc.com

# Clone the agnosticd workloads repo
git clone https://github.com/redhat-cop/agnosticd/ agnosticd
cd agnosticd/ansible

ansible-playbook -i ${TARGET_HOST}, ./configs/ocp-workloads/ocp-workload.yml \
      -e"ansible_ssh_private_key_file=~/.ssh/id_rsa" \
      -e"ansible_user=${OCP_USERNAME}" \
      -e"ocp_username=${OCP_USERNAME}" \
      -e"ocp_workload=${WORKLOAD}" \
      -e"guid=${GUID}" \
      -e"num_users=${USER_COUNT}" \
      -e"ocp_workload_test=true" \
      -e"ocp_user_needs_quota=true" \
      -e"ocp_apps_domain=${APPS_DOMAIN}" \
      -e"ACTION=create"
```
