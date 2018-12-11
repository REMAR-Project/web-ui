from app.tables import blueprint
from flask import render_template

from flask_login import login_required

import json
import sys #for print
import requests
import datetime as dt
from collections import OrderedDict

def julian(year, month, day):
    a = (14-month)/12.0
    y = year+4800-a
    m = (12*a)-3+month
    return day + (153*m+2)/5.0 + (365*y) + y/4.0 - y/100.0 + y/400.0 - 32045


def phase(dateString):

    splitDate = dateString.split("/")

    day = int(splitDate[0])
    month = int(splitDate[1])
    year = int(splitDate[2])

    p = (julian(year, month, day) - julian(2000, 1, 6)) % 29.530588853

    if   p < 1.84566:  return [0, 0, 1, 0, 0, 1]
    elif p < 5.53699:  return [0, 0, 0, 1, 0, 1]
    elif p < 9.22831:  return [0, 0, 0, 0, 1, 1]
    elif p < 12.91963: return [0, 0, 0, 0, 1, 1]
    elif p < 16.61096: return [1, 0, 0, 0, 0, 1]
    elif p < 20.30228: return [0, 1, 0, 0, 0, 1]
    elif p < 23.99361: return [0, 0, 0, 0, 1, 1]
    elif p < 27.68493: return [0, 0, 0, 0, 1, 1]
    else:              return [0, 0, 1, 0, 0, 1]

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


    # change moon state into categories
    for user in entries:
        moonSet = []
        if (user["moonState"].__contains__("full") is True):
            moonSet.append("FS") # full moon spawning

        if (user["moonState"].__contains__("waning gibbous") is True):
            moonSet.append("FM") # full moon mating
        
        if (user["moonState"].__contains__("new") is True):
            moonSet.append("NS") # new moon spawn

        if (user["moonState"].__contains__("waxing crescent") is True):
            moonSet.append("NM") # new moon mating

        
        if (user["moonState"].__contains__("first quarter") is True or user["moonState"].__contains__("waxing gibbous") is True or user["moonState"].__contains__("last quarter") is True or user["moonState"].__contains__("waning crescent") is True):
            moonSet.append("A") # new moon mating

        user["moonState"] = moonSet
            

    regions = json.loads(regionjson.text, object_pairs_hook=OrderedDict)
    regDoc = regions['rows'][0]['doc']

    # dictionary for dates with moons
    dateList = {}


    
    
    # get dates
    for user in entries:
        for val in user['dateRange']:
            try:
                dateList[val][5] += 1
            except KeyError as e:
                dateList[val] = phase(val)


    


    return render_template(template + '.html', dates=dateList, test=entries, userlist=users, regions=regDoc)

    