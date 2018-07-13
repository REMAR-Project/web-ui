#!/usr/bin/env python3

import json
import glob
import uuid

class User(object):
    def __init__(self, phoneid):
        self.phoneid = phoneid
        self.uuids = []
        self.files = []
        # generate new user id to be used in public data
        self.generatedID = uuid.uuid1()

    def addUUID(self, uuid, fileName):
        # store the uuids attached to this phone id
        self.uuids.append(uuid)
        # store where uuid was retrived from
        self.files.append(fileName)

    def __str__(self):
        return "I am user " + str(self.generatedID) + " - I have " + str(len(self.uuids)) + " associated uuids"


phoneList = {}

def generate() :
    folders = "/etc/crab/data_11_06_2018/users/"

    # glob files
    files = glob.glob(folders+'/*.json')

    print ("Total user entries: " + str(len(files)))

    if (len(files) == 0):
        print ("No files found")
        exit()

    # add json to data list.
    for file in files:
        with open(file, "rb") as handle:
            data = json.loads(handle.read())
                
            pid = data['phone']['phone_id']
            
            # try adding uuid to user, create new user if needed
            try :
                phoneList[pid].addUUID(data['uuid'], file)
            except (KeyError) :
                phoneList[pid] = User(pid)
                phoneList[pid].addUUID(data['uuid'], file)
                

