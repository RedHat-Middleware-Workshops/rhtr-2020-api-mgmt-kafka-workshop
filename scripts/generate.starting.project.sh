DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
FILENAME="project.starter.yml"

cd $DIR/..

# create the initial file
rm $FILENAME
touch $FILENAME

append_api_objects () {
    echo "Appending YAML from $1"
    FILES=$(ls $1)
    for file in $FILES; do
        echo "---" >> $FILENAME
        cat $1/$file >> $FILENAME
        echo "" >> $FILENAME
    done
}

append_api_objects "services/postgresql/openshift"
append_api_objects "services/sensor-management-ui/openshift"
append_api_objects "services/iot-graphql-api/openshift"
append_api_objects "services/iot-data-generator/openshift"