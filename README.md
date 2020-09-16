# RHTR 2020 Kafka and API Management IoT Lab

## Local Development & Deployment

Refer to the [services README](/services).

## Deployment on OpenShift

```bash
# Generate project.yml from individual definitions in each service
./scripts/generate-project.sh

# Create a project namespace and apply the project.yml resources
oc new-project city-of-la
oc apply -f project.yml
```
