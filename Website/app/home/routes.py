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
    users = []
    totalCount = 0
    longCount = 0
    for element in myjson.json()['rows']:
        entries.append(element['doc'])
        totalCount += 1
        longCount += element['doc']['type']
        users.append(element['doc']['uuid'])

    shortCount = totalCount - longCount

    userCount = len(set(users))

    return render_template('index.html', docCount=dbOverview.json()['doc_count'], shortCount=shortCount, longCount=longCount, userCount=userCount, record=entries)


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')