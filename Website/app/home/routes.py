from app.home import blueprint
from flask import render_template
from flask_login import login_required

import requests
import json
import sys

@blueprint.route('/index')
@login_required
def index():
    
    print("hello world", file=sys.stderr)
    # total number of submissions
    dbOverview = requests.get('http://localhost:5984/cleancrab/')
    
    print (dbOverview.json()['doc_count'], file=sys.stderr)

    # get all docs
    myjson = requests.get('http://localhost:5984/cleancrab/_all_docs?include_docs=true')


    # for each id, save entry
    #print(myjson.json(), file=sys.stderr)
    entries = []
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
    
    return render_template('index.html', docCount=dbOverview.json()['doc_count'], record=entries)


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')