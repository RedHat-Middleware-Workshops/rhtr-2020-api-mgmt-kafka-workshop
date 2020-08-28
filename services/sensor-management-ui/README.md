# Sensor Management UI

A web application that can be used to manage the IoT devices.

## Build & Run Locally

First install dependencies:

```bash
# install dependencies
npm install

# run in hot module reloading mode
npm run dev
```

## Create a Production Bundle

This will generate a bundle of production optimised static assets in a *dist/*
directory in the project folder:

```bash
npm run build
```

## Create a Development Bundle

This will generate a bundle of static assets in a *dist/* directory in the
project folder:

```bash
npm run build:dev
```

## Create a Deployable NGINX Container Image

Each of the options below relies on the `npm build` (alias for `npm run build`)
command to create a *dist/* folder in the root of your project that contains
all the static assets for the application, i.e HTML, CSS, JavaScript, and
binary files.

This folder can safely (and probably should be!) added to the *gitignore* since
each build option will generate it using `npm build`.

### Using Chained s2i Builds on OpenShift

Uses [source-to-image (s2i)](https://github.com/openshift/source-to-image) on
an OpenShift cluster to chain two builds. Requires the [OpenShift CLI](https://docs.openshift.com/container-platform/4.5/cli_reference/openshift_cli/getting-started-cli.html).

The first build uses a Node.js builder image to prepare the static assets
using Webpack. The second build uses an NGINX builder image to take the static
assets from the first Node.js build and produce a deployable NGINX container
image.

```bash
export GIT_REPO=https://github.com/evanshortiss/rhtr-2020-api-mgmt-kafka

# Create a Node.js build to run Webpack and store the results
# in a Node.js container image. This image won't be deployed
oc new-build nodejs~$GIT_REPO --name sensor-ui-build \
--context-dir=services/sensor-management-ui

# After the first build is finished and stored in
# the OpenShift registry pass it to an NGINX build
oc new-build --name=sensor-ui-runtime \
--docker-image=centos/nginx-116-centos7 \
--source-image=sensor-ui-build \
--source-image-path="/opt/app-root/src/dist/.:." \
--strategy=source

# Create a Deployment the new nginx container
oc new-app sensor-ui-runtime

# Optional label/annotations to show an NGINX
# icon on the topology view in the OpenShift UI
oc annotate dc/sensor-ui-runtime app.openshift.io/runtime=nginx
oc label dc/sensor-ui-runtime app.openshift.io/runtime=nginx
```

The second build (sensor-ui-runtime) will start anytime the first build
(sensor-ui-build) finishes. Run `oc start-build sensor-ui-runtime` to
trigger a new build, or setup your own [Build Triggers](https://docs.openshift.com/container-platform/4.5/builds/triggering-builds-build-hooks.html).

### Using a Custom s2i Build Image on OpenShift

Uses [source-to-image (s2i)](https://github.com/openshift/source-to-image)
to perform a single build. Requires the [OpenShift CLI](https://docs.openshift.com/container-platform/4.5/cli_reference/openshift_cli/getting-started-cli.html).

```bash
export GIT_REPO=https://github.com/evanshortiss/rhtr-2020-api-mgmt-kafka
export BUILDER_IMAGE=quay.io/evanshortiss/s2i-nodejs-nginx

# Build and deploy the application using the s2i-nodejs-nginx builder
oc new-app $BUILDER_IMAGE~$GIT_REPO --name sensor-ui-build
```

### Using a Local s2i Build

Uses [source-to-image (s2i)](https://github.com/openshift/source-to-image) to
create an NGINX container image that serves the application assets.

You need to
[install s2i](https://github.com/openshift/source-to-image#installation) and
[Docker](https://docs.docker.com/get-docker/) before running the commands
below to generate a container image.

Once s2i is installed, create a build with the following command:

```bash
# use the s2i-nodejs-nginx image with Node.js 14 to build this application
# into a deployable NGINX 1.18 container image named "my-web-app"
s2i build -c . quay.io/evanshortiss/s2i-nodejs-nginx:14-nginx1.18 sensor-ui-runtime
```

Alternatively use this shorthand command:

```bash
npm run docker:build
```

And run it locally using Docker or Podman:

```bash
docker run -p 8080:8080 sensor-ui-runtime
```
