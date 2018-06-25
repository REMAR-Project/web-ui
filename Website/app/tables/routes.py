from app.tables import blueprint
from flask import render_template

from flask_login import login_required

import json
import sys #for print
import requests


@blueprint.route('/<template>')
@login_required
def route_template(template):
    
    myjson = requests.get('http://localhost:5984/cleancrab/2018-01-19T16-20-22_2cd088ea-577d-4729-9870-ef68d93c8bfc.json')

    entries = []
    entries.append(myjson.json())
    
    return render_template(template + '.html', test=entries)




def testFun():
    #my_dict["hello"] = "hello"
    myjson = requests.get('http://localhost:5984/cleancrab/2018-01-19T16-20-22_2cd088ea-577d-4729-9870-ef68d93c8bfc.json')
   # my_dict["me"] = response
   # my_dict["gb"] = "Goodbye"
    print("lol", file=sys.stderr)
    print(myjson.content, file=sys.stderr)
    print("h", file=sys.stderr)