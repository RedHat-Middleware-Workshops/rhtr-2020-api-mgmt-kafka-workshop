# RHTR 2020 Kakfa and API Management IoT Lab

## Local Deployment

Tested using Docker Community v19:

```bash
git clone $THIS_REPO rhtr-2020-lab
cd rhtr-2020-lab

docker-compose up
```

After `docker-compose up -d` has finished, you'll have 4 services running:

* MongoDB (http://localhost:27017)
* IoT Data Generator (http://localhost:8082)
* IoT Devices GraphQL API (http://localhost:8081)
* IoT Devices Management Portal (http://localhost:8080)
