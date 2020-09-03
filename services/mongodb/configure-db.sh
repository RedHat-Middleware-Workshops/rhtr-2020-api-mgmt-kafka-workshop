HOSTNAME=`hostname`

mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD localhost:27017/admin <<-EOF
    print("create mongoadmin user")
    db.createUser({ user: "mongoadmin" , pwd: "mongoadmin", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]});
EOF

mongo -u mongoadmin -p mongoadmin localhost:27017/admin <<-EOF
    print("create to city-info database and collections")
    use city-info
    print("change to admin database")
    use admin
    db.runCommand({
        createRole: "listDatabases",
        privileges: [
            { resource: { cluster : true }, actions: ["listDatabases"]}
        ],
        roles: []
    });

    db.createUser({
        user: 'debezium',
        pwd: 'debeziumpass',
        roles: [
            { role: "readWrite", db: "city-info" },
            { role: "read", db: "local" },
            { role: "listDatabases", db: "admin" },
            { role: "read", db: "config" },
            { role: "read", db: "admin" }
        ]
    });
EOF

mongoimport --db city-info --collection junctions --file /docker-entrypoint-initdb.d/junction_info.json --jsonArray
mongoimport --db city-info --collection meters --file /docker-entrypoint-initdb.d/meter_info.json --jsonArray

# Run this after the container has initialised
# mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD localhost:27017/admin --eval rs.initiate({ _id: "rs0", members: [ { _id: 0, host: "localhost:27017" } ] });