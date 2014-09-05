# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from contextlib import closing


# create our little application :)
app = Flask(__name__)
app.config.from_object('app.config')

#connect to database
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

#initialises database
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

from app.core.views import mod as core
app.register_blueprint(core)
