# Script to pull data into db
echo Hello World

# iterate through sightings and print


find /etc/crab/*/sightings/ -name \*.json -print0 | while read -d $'\0' file; do
    filename="${file##*/}"
    printf "%s\n" "added $filename";
    curl -X PUT -d @"$file" http://127.0.0.1:5984/rawcrab/"$filename"
done
