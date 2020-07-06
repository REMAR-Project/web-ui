# REMAR: Web UI

This is a web-application that has been developed for online analysis of data collected from the [REMAR Android Application](https://github.com/REMAR-Project/android-app). This is part of a citizen science based research project that is concerned with the sustainable fishing and conservation of Mangrove Crabs in Brazil.

## Server commands

To start the server: `$ sudo start uwsgi`

and to stop it: `$ sudo stop uwsgi`

There is a cron job set to run at midnight everyday:

```bash
* 0 * * * /bin/bash /etc/crab/REMAR-Server/ShellScripts/dataPull.sh > /etc/crab/testlog.txt
```
this should read any exisiting files from the data folder and upload them to the rawcrab server. A python script is then run to sanitise the data, this is then added to the "cleancrab" database which is what the webpage accesses.

If you need to completely refresh the data (delete the databases and re-add the files), use 
 `/etc/crab/REMAR-Server/ShellScripts/cleanRefresh.sh`
 
## Flask

For development, I recommend ssh tunneling the DB port (5984). For example:

```bash 
ssh -L 5984:localhost:5984 user@crab.napier.ac.uk
```

This will allow you to access the database from your own development envrionment from localhost.

To Run Flask App:

Install requirements, set environment variables then run. 

```bash
pip install -r requirements.txt

export FLASK_APP=REMAR-Data.py
export FLASK_DEBUG=1
flask run --host=0.0.0.0
```


## Couch DB 

Created CouchDB rawcrab and cleancrab data.
http://docs.couchdb.org/en/2.1.1/intro/index.html

*Quick Commands:*

Show all dbs
`curl -X GET http://127.0.0.1:5984/_all_dbs`
 
Show specific db
	`curl -X GET http://127.0.0.1:5984/rawcrab`
 
Add document to db
	`curl -X PUT -d @filepath.json  http://127.0.0.1:5984/rawcrab/test`
where test is the uuid for accessing the document again,

Shows Document
	`curl -X GET http://127.0.0.1:5984/rawcrab/test`


## Data

A new UUID is generated to be accesible on the web interface. Every original uuid is matched to the phone id, therefore phones with multiple uuids associated with them are treated as one user now.

Check recordClass.py for the descriptions of the data that was matched to each question. 
