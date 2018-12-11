#!/bin/bash

##deletes database, creates new db, runs pythonscript to populate

curl -X DELETE localhost:5984/cleancrab
curl -X PUT localhost:5984/cleancrab

source /etc/crab/env/bin/activate
/etc/crab/REMAR-Server/PythonScripts/main.py
