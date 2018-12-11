from app.data import blueprint
from flask import render_template
from flask_login import login_required

import json
import requests
import re


@blueprint.route('/<template>')
@login_required
def route_template(template):

    myjson = requests.get('http://localhost:5984/cleancrab/_all_docs?include_docs=true')

    entries = []
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
    

    # count responses for each state
    states = []
    for entry in entries :
      states.append(str(entry['state']))

    stateCount = {i:states.count(i) for i in states}

    # change keys to country codes 

    # open country codes
    ccodes = json.loads('{"Alagoas":{"code":"al"},"Amapá":{"code":"ap"},"Bahia":{"code":"ba"},"Ceará":{"code":"ce"},"Espírito Santo":{"code":"es"},"Maranhão":{"code":"ma"},"Paraná":{"code":"pr"},"Paraíba":{"code":"pb"},"Pará":{"code":"pa"},"Pernambuco":{"code":"ma"},"Piauí":{"code":"pi"},"Rio Grande do Norte":{"code":"rn"},"Rio de Janeiro":{"code":"rj"},"Santa Catarina":{"code":"sc"},"Sergipe":{"code":"se"},"São Paulo":{"code":"sp"}}')


    stateAns = {}
    for state in stateCount:
        try:
            stateAns[str(ccodes[state]['code'])] = stateCount[state]
        except:
            print("key error")

            
    county = []
    for entry in entries :
      county.append(str(entry['county']))

    countyAns = {i:county.count(i) for i in county}

    return render_template(template + '.html', crabState=stateAns, crabCounty=countyAns)
