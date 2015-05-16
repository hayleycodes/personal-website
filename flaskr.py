#all the imports
import sqlite3
from sqlite3 import dbapi2 as sqlite3

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from contextlib import closing

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS')

connect to database
def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv
    #return sqlite3.connect(app.config['DATABASE'])
initialises database
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db
runs before each request
@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
def home():
    return render_template('home.html')


#@app.route('/blog')
#def blog():
#    return render_template('blog.html')

@app.route('/blog')
def show_entries():
    db = get_db()
    cur = db.execute('SELECT * FROM entries ORDER BY id DESC')
    entries = cur.fetchall()
    return render_template('articles.html', entries=entries)

@app.route('/projects')
def projects():
    return render_template('timeline.html')


@app.route('/3dnz')
def NZ():
    return render_template('3DNZ.html')


@app.route('/articles')
def articles():
    return render_template('articles.html')


@app.route('/timeline')
def timeline():
    return render_template('timeline.html')


@app.route('/contactform')
def contactform():
    return render_template('contactform.html')


@app.route('/viewpost/<postID>')
def viewpost(postID):
    db = get_db()
    cur = db.execute('SELECT id, title, text FROM entries WHERE id = ?', [postID])
    post = cur.fetchone()
    return render_template('viewpost.html', post=post)


#adds users entered data to database
@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    g.db.execute('INSERT INTO entries (title, text) VALUES (?, ?)',
                 [request.form['title'], request.form['text']])
    g.db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('show_entries'))


@app.route('/edit', methods=['POST'])
def edit_entry():
    print('here')
    if not session.get('logged_in'):
        abort(401)
    print('here')
    g.db.execute('UPDATE entries SET title = ?, text = ? WHERE id == ?',
                 [request.form['title'], request.form['text'], request.form['id']])
    g.db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('show_entries'))


@app.route('/delete/<postID>', methods=['POST'])
def delete_entry(postID):
    if not session.get('logged_in'):
        abort(401)
    g.db.execute('DELETE FROM entries WHERE id = ?', [postID])
    g.db.commit()
    flash('Entry was deleted')
    return redirect(url_for('show_entries'))
    #return render_template('blog.html')


#logs in users
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_entries'))
    return render_template('login.html', error=error)


#logs out user
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    #return redirect(url_for('show_entries'))
    return redirect(url_for('home'))



#runs server
if __name__ == '__main__':
    app.run()
