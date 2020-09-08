# RHTR 2020 - Services

## Architecture

![Lab Architecture Diagram](/images/architecture.png)

## Services List

The following is a list of the services deployed during the lab, and the
host/port combination that they're available on if deployed locally using
Docker.

* MongoDB (http://localhost:27017)
* IoT Data Generator (http://localhost:8082)
* IoT Devices GraphQL API (http://localhost:8081)
* IoT Devices Management Portal (http://localhost:8080)

The [IoT Devices Management Portal](http://localhost:8080) provides an overview
of the device network.

The [IoT Devices GraphQL API](http://localhost:8081/graphql) exposes a GraphQL
API and the GraphQL Playground to experiment with queries.

The [Iot Data Generator](http://localhost:8082) simulates the IoT devices, and
MongoDB stores IoT device data. The Iot Data Generator is also responsible for
seeding the initial data into the database.


## Local Development via Docker

*NOTE: Testing and development was performed using Docker Community v19. YMMV with different versions.*

```bash
git clone git@github.com:evanshortiss/rhtr-2020-api-mgmt-kafka.git rhtr-2020-lab

cd rhtr-2020-lab/services

# Create a network
docker network create rhtr-lab

# Build, run, and configure MongoDB
docker build ./mongodb -t rhtr-mongodb
docker run -d --network rhtr-lab -p 27017:27017 --name city-mongodb rhtr-mongodb
docker exec -it city-mongodb /bin/bash
mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD localhost:27017/admin --eval "rs.initiate({ _id: 'rs0', members: [ { _id: 0, host: 'localhost:27017' } ] });"
```

Type `exit` to exit the `mongo` process, and type `exit` again to leave the
container. Next start the services:

```bash
# Pass any non-empty string for GOOGLE_MAPS_API_KEY if you don't have a key, but
# note that the maps feature in the UI will display an error
docker-compose build --build-arg GOOGLE_MAPS_API_KEY=<an-api-key>
docker-compose up -d
```

After `docker-compose up -d` has finished, you'll have all services running.

If you make changes to the services themselves, you can rebuild and redeploy
like so:

```bash
docker-compose build --build-arg GOOGLE_MAPS_API_KEY=<an-api-key>
docker-compose down
docker-compose up -d
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

### MongoDB (pre-deploy)

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
  * Update the `datamodel.graphql` file to match the MongoDB collection schema.
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

* ETL data from Kafka topics to MongoDB `events` collection.
* Attendees can use Che to configure and deploy the Camel routes.
* Alternatively, can be pre-deployed using Ansible.

### Quarkus SSE Service (lab-service)

* Provides real-time data feed to mobile application.
* Attendees start with a template and use Che to deploy it.

### Mobile Application (partial pre-deploy)

* Attendees must reconfigure the *BuildConfig* with:
  * Quarkus SSE Server URL (for real-time data)
  * GraphQL API URL (for meter/junction lookup data)
