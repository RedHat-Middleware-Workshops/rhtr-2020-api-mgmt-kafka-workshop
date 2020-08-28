# RHTR 2020 Kakfa and API Management IoT Lab

## Local Deployment

Tested using Docker Community v19:

```bash
git clone git@github.com:evanshortiss/rhtr-2020-api-mgmt-kafka.git rhtr-2020-lab

cd rhtr-2020-lab/services

docker-compose up -d
```

After `docker-compose up -d` has finished, you'll have 4 services running:

* MongoDB (http://localhost:27017)
* IoT Data Generator (http://localhost:8082)
* IoT Devices GraphQL API (http://localhost:8081)
* IoT Devices Management Portal (http://localhost:8080)

Visit the [IoT Devices Management Portal](http://localhost:8080) to explore an
overview of the device network.
