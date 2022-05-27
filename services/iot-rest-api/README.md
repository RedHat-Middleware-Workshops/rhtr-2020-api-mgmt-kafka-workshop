# iot-rest-api

Use this to interact with meter records in the database.

## Local Usage

Using a Postgres database running on OpenShift helps. Use the port forward
feature of the OpenShift CLI to access the remote DB:

```
export DB_POD=$(oc get pods | grep psq | grep -i running | awk '{print $1}')
oc port-forward $DB_POD 5432:5432
```

Start the REST API:

```
npm install

export DATABASE_URL=postgres://rhtr-user:rhtr-pass@localhost:5432/city-info
npm run dev
```

Open http://localhost:8080/documentation to interact with the Swagger Docs.
