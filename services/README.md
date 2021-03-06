# RHTR 2020 - Services

## Architecture

![Lab Architecture Diagram](/images/architecture.png)

## Services List

The following is a list of the services running as containers during the lab, and the
host/port combination that they're available on if deployed locally using
Docker.

* PostgreSQL (localhost:5432)
* IoT Data Generator (http://localhost:8082)
* IoT Devices GraphQL API (http://localhost:8081)
* IoT Devices Management Portal (http://localhost:8080)

The [IoT Devices Management Portal](http://localhost:8080) provides an overview
of the device network.

The [IoT Devices GraphQL API](http://localhost:8081/graphql) exposes a GraphQL
API and the GraphQL Playground to experiment with queries.

The [Iot Data Generator](http://localhost:8082) simulates the IoT devices, and
PostgreSQL stores IoT device data. The Iot Data Generator is also responsible for
seeding the initial data into the database.


## Local Development via Docker

*NOTE: Testing and development was performed using Docker Engine Community v19. YMMV with different versions.*

```bash
# Passing GOOGLE_MAPS_API_KEY is optional. If you don't pass a valid key
# the sensor management UI will not display a map, but is otherwise OK
docker-compose build --build-arg GOOGLE_MAPS_API_KEY=<an-api-key>
docker-compose up
```

After inspecting `docker-compose up` we could see that, you'll have all services running.

If you make changes to the services themselves, you can rebuild and redeploy
like so:

```bash
docker-compose build --build-arg GOOGLE_MAPS_API_KEY=<an-api-key>
docker-compose down
docker-compose up
```

## Services Usage in Lab Content

Each service in the lab is required to create the end-to-end solution. Some
services can be deployed via Ansible prior to the lab.

Each service below has an indicator to represent if it's created prior to,
or during the lab:

* `pre-deployed`: Created by Ansible prior to the lab.
* `partial pre-deploy` - Created by Ansible prior to the lab. Require configuration by attendee.
* `lab service` - Created and deployed by the lab attendee.

### Kafka & Topics (partial pre-deploy)

* Ansible will:
  * Install the Strimzi operator on the cluster.
  * Pre-create the Junctions and Meters topics.
* Attendees will create:
  * DB Changes topic.
  * Processed stream data topic.

### Kafka Streams (lab-service)

* Lab attendees will deploy this based on a template repository using Che.

### PostgreSQL (pre-deploy)

* Shared database used to store:
  * In service parking meters (collection name: `meters`)
  * In service traffic junctions (collection name: `junctions`)
  * IoT events captured from meters and junctions (collection name: `events-attendee-N`, where `N` is a unique user ID/number)
* This is deployed in a protected project/namespace by Ansible.

### IoT Devices GraphQL API (lab service)

Uses [Graphback](https://graphback.dev/) to auto generate GraphQL resolvers for
[queries and mutations](https://graphql.org/learn/queries/).

* Developed during the lab using Che:
  * Start with a template repository/
  * Deploy and test with a default data model to learn about Graphback and GraphQL.
  * Update the `datamodel.graphql` file to match the PostgreSQL table schema.
  * Redeploy using `nodeshift` CLI and verify correct data can be retrieved via the GraphQL endpoint.
* Alternatively, deploy this with Ansible and a valid `datamodel.graphql` file to save time.

### IoT Devices Management Portal (partial pre-deploy)

* Requires *IoT Devices GraphQL API* GraphQL API URL. Lab attendees set this
after deploying that service:
  * `oc set env bc/device-portal IOT_GRAPHQL_HOST=<service-hostname>`
  * `oc start-build device-portal`
* Requires a valid Google Maps API Key. Lab attendees can address this via:
  * `oc set env bc/device-portal GOOGLE_MAPS_API_KEY=<an-api-key>`
  * `oc start-build device-portal`

### 3scale AMP (pre-deploy)

* Pre-deploy using Ansible.
* Create a tenant per lab attendee.
* Users will create required *products* and *backends* to complete the lab.

### Camel Data Ingestion (lab-service)

* ETL data from Kafka topics to PostgreSQL `events` table.
* Attendees can use Che to configure and deploy the Camel routes.
* Alternatively, can be pre-deployed using Ansible.

### Quarkus SSE Service (lab-service)

* Provides real-time data feed to mobile application.
* Attendees start with a template and use Che to deploy it.

### Mobile Application (partial pre-deploy)

* Attendees must reconfigure the *BuildConfig* with:
  * Quarkus SSE Server URL (for real-time data)
  * GraphQL API URL (for meter/junction lookup data)
