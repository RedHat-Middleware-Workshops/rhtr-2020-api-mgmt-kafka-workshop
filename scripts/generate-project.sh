DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..

FOLDERS=$(find . -name "openshift")

# create the initial file
rm project.yml
touch project.yml

# append all files to the project.yml
for folder in $FOLDERS; do
    FILES=$(ls $folder)
    for file in $FILES; do
        echo "---" >> project.yml
        cat $folder/$file >> project.yml
        echo "" >> project.yml
    done
done