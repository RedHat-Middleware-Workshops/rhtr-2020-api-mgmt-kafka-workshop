DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..
FILENAME="project.complete.yml"
FOLDERS=$(find . -name "openshift" -maxdepth 4)

# create the initial file
rm $FILENAME
touch $FILENAME

# append all files to the $FILENAME
for folder in $FOLDERS; do
    FILES=$(ls $folder)
    for file in $FILES; do
        echo "---" >> $FILENAME
        cat $folder/$file >> $FILENAME
        echo "" >> $FILENAME
    done
done