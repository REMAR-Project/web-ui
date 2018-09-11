#!/usr/bin/env python3

from recordClass import Short
from recordClass import Long
import users
import json
import glob
import requests
import os

folders = "/etc/crab/data_11_06_2018/sightings/"

# glob files
files = glob.glob(folders+'/**/**/**/*.json')

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

# generate user ids
users.generate()

# Create Objects for each file 
recordsList = []

states = ["Alagoas", "Amapá", "Bahia", "Ceará", "Espírito Santo", "Maranhão", "Paraná", "Paraíba", "Pará", "Pernambuco", "Piauí", "Rio Grande do Norte", "Rio de Janeiro", "Santa Catarina", "Sergipe", "São Paulo"]

def validateVersionCorrect(item):
    #check if state exists in q6 if so, definitely short (see "57591dd5-758b-4dcf-bc64-782e63687fd0" for issue)
    try:
        if (dataList[item]['sightings'][0]['answers'][0]['6'][0] in states):
            return True
        else :
            return False
    except:
        print( "Version error found in " + item)
        return False

for item in dataList:
    if (dataList[item]['sightings'][0]['answers'][0]['1'][0] == str(0) and validateVersionCorrect(item)):
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

