# 3scale and Keycloak Client-Side OIDC Example

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The meter icon is by Freepik<a href="https://www.flaticon.com/free-icons/meter" title="meter icons">on Flaticon</a>.

## Local Development

These local development steps assume you've already

1. Create a `.env.local` file based on the `env.local.template`
1. Run `npm install`
1. Run `npm start`

## Deploying on OpenShift

```bash
# Builder image and source code
export BRANCH='#2022-refresh'
export BUILDER=quay.io/evanshortiss/s2i-nodejs-nginx:latest
export SOURCE="https://github.com/RedHat-Middleware-Workshops/rhtr-2020-api-mgmt-kafka-workshop$BRANCH"

# Keycloak specific configs, used by the Keycloak JS adapter
# IMPORTANT: no trailing slash after the "auth" in KEYCLOAK_URL
export KEYCLOAK_URL=https://keycloak-server-url.com/auth
export KEYCLOAK_REALM=name-of-realm
export KEYCLOAK_CLIENT_ID=name-of-client

# Protected API host, used to fetch meters
export API_URL=https://path.to-meters.com/


oc new-app $BUILDER~$SOURCE \
-l "app.openshift.io/runtime=nginx"
--context-dir=client-side-oidc-access/ \
--build-env REACT_APP_KEYCLOAK_URL=$KEYCLOAK_URL \
--build-env REACT_APP_KEYCLOAK_REALM=$KEYCLOAK_REALM \
--build-env REACT_APP_KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
--build-env REACT_APP_API_URL=$API_URL \
--build-env BUILD_OUTPUT_DIR=build \
--name client-webapp

# Expose the service via HTTPS
oc expose svc client-webapp
oc patch route client-webapp --type=json -p='[{"op":"replace","path":"/spec/tls","value":{"termination":"edge","insecureEdgeTerminationPolicy":"Redirect"}}]'

# Print the URL used to access the application
oc get route client-webapp -o jsonpath='{.spec.host}'
```
