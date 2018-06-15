
from recordClass import Short
from recordClass import Long
import json
import glob

folders = "data_11_06_18/data/sightings/"

# glob files
files = glob.glob('./'+folders+'/**/**/**/*.json', recursive=True)

print ("Total entries: " + str(len(files)))

dataList = {}

# add json to data list.
for file in files:
    with open(file, "r") as handle:
        data = json.loads(handle.read())

    # Only add to list if version is 1.0
    if (data['sightings'][0]['answers'][0]['0'][0] == str(1.0)): 
        dataList[file] = data


# Create Objects for each file 
recordsList = []

for item in dataList:
    if (dataList[item]['sightings'][0]['answers'][0]['1'][0] == str(0)):
        tempRecord = Short(item)
        recordsList.append(tempRecord)
    else :
        tempRecord = Long(item)
        recordsList.append(tempRecord)

# re-write file
with open("data_file.json", "w") as write_file:
    json.dump(recordsList[0].__dict__, write_file)        
    
