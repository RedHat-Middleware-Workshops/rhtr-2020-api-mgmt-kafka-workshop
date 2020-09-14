# Real-time Mobile Application

Displays a real-time feed of meter and junction state updates. The feed is
provided by a Quarkus application using server-sent events.

## Local Development

Before running the application you must first start the Quarkus SSE server:

```bash
cd services/iot-sse-server
docker-compose up -d
mvn quarkus:dev
```

Leave the Quarkus server running in the first terminal. In a second terminal,
run the following commands:

```bash
cd services/mobile-app
npm install
npm start
```

## Configuration

Build-time environment variables:

* REACT_APP_SSE_HOSTNAME
  * Defaults to http://localhost:8080 during development.
  * If not set for a live deployment, the application will assume the SSE server is on the same top-level domain, but uses the subdomain `iot-sse-server`. [URL resolution code](/src/utils.ts).

## Deployment

### Apply YAML

```
oc apply -f services/mobile-app/openshift/
```

### Source-to-Image

```
export REPO_URL=https://github.com/RedHat-Middleware-Workshops/rhtr-2020-api-mgmt-kafka-workshop

oc new-app quay.io/evanshortiss/s2i-nodejs-nginx~$REPO_URL \
--name='mobile-app' --build-env BUILD_OUTPUT_DIR=build \
--context-dir='services/mobile-app'
```

## Credits

Photo by [Denys Nevozhai](https://unsplash.com/@dnevozhai?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on Unsplash.
