from app.tables import blueprint
from flask import render_template

from flask_login import login_required

import json
import sys #for print
import requests
from collections import OrderedDict

@blueprint.route('/<template>')
@login_required
def route_template(template):
    
    # get all docs
    myjson = requests.get('http://localhost:5984/cleancrab/_all_docs?include_docs=true')

    # get regions from db
    regionjson = requests.get('http://localhost:5984/regions/_all_docs?include_docs=true')

    # for each id, save entry
    #print(myjson.json(), file=sys.stderr)
    entries = []
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
 
    users = {}   

    # users.bob.card = ["1", "4"] (JAN, APR etc)    

    for user in entries:
        try:
            crab = ""
            #check what crab was spotted
            if user["species"] == 0:
                crab = "ucid"
            else :
                crab = "card"
            
            # need to check whether usage or crab spotting 
            users[user["uuid"]][crab].append(user["submission"])
            users[user["uuid"]]["profession"].append(user["job"])
        except KeyError as error:
            users[user["uuid"]] = {}
            users[user["uuid"]]["card"] = []
            users[user["uuid"]]["ucid"] = []   
            users[user["uuid"]]["profession"] = []

            crab = ""
            if user["species"] == 0:
                crab = "ucid"
            else :
                crab = "card"
            users[user["uuid"]][crab].append(user["submission"])
            users[user["uuid"]]["profession"].append(user["job"])



    
    profAnswers = {
        "• I catch crabs and depend on them for my living": "Professional Fisher",
        "• I catch crabs only occasionally for my own consumption": "Own Consumption",
        "• I work with crab meat processing": "Meat Processor",
        "• I work with crab commercialization": "Trader",
        "• I am a local villager and do not normally catch mangrove crabs": "Observing Villager",
        "• I work for ICMBio": "ICMBio",
        "• I work for IBAMA": "IBAMA",
        "• I work in the city hall": "City Hall",
        "• I am a researcher": "Researcher",
        "• I do not want to specify": "Not specified",
        "• Pego caranguejo-uçá ou guaiamum e dependo deste recurso para viver": "Professional Fisher",
        "• Pego caranguejo-uçá ou guaiamum apenas ocasionalmente para consumo": "Own Consumption",
        "• Sou beneficiador de carne de caranguejo-uçá": "Meat Processor",
        "• Sou comerciante de caranguejo-uçá ou guaiamum": "Trader",
        "• Sou morador local e normalmente não pego caranguejos ou guaiamuns": "Observing Villager",
        "• Sou funcionário do ICMBio": "ICMBio",
        "• Sou funcionário do IBAMA": "IBAMA",
        "• Sou servidor da Prefeitura": "City Hall",
        "• Sou pesquisador": "Researcher",
        "• Não quero informar": "Not specified",
    }
    
    # change user profession array into a set to only show unique answers
    for user in users:
        uniquelist = []
        for job in users[user]["profession"]:
            try:
                shortTitle = profAnswers[job]
            except TypeError as error: # other job
                shortTitle = str(job)
            
            if (uniquelist.__contains__(shortTitle) is not True):
                uniquelist.append(shortTitle)


        users[user]["profession"] = uniquelist



    regions = json.loads(regionjson.text, object_pairs_hook=OrderedDict)
    regDoc = regions['rows'][0]['doc']

    return render_template(template + '.html', test=entries, userlist=users, regions=regDoc)

    