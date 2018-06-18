#!/usr/bin/env python3

from recordClass import Short
from recordClass import Long
import json
import glob
import requests
import os

folders = "/etc/crab/data_11_06_2018/sightings/"

# glob files
files = glob.glob(folders+'/**/**/**/*.json', recursive=True)

print ("Total entries: " + str(len(files)))

if (len(files) == 0):
    print ("No files found")
    exit()

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

for record in recordsList:
    
    # serialise to json 
    data = json.dumps(record.__dict__)

    # curl to insert into clean db
    response = requests.put('http://127.0.0.1:5984/cleancrab/'+os.path.basename(record.fileName), data=data)
    print ("Added" + os.path.basename(record.fileName))

