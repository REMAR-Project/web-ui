from app.home import blueprint
from flask import render_template
from flask_login import login_required

import requests
import sys

@blueprint.route('/index')
@login_required
def index():
    
    print("hello world", file=sys.stderr)
    # total number of submissions
    dbOverview = requests.get('http://localhost:5984/cleancrab/')
    
    print (dbOverview.json()['doc_count'], file=sys.stderr)

    return render_template('index.html', docCount=dbOverview.json()['doc_count'])


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')
