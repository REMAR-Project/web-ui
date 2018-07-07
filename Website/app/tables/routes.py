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
    
    regions = json.loads(regionjson.text, object_pairs_hook=OrderedDict)
    regDoc = regions['rows'][0]['doc']

    return render_template(template + '.html', test=entries, regions=regDoc)

    