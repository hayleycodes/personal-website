import os
from flask import Flask, render_template

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)
port = int(os.environ.get('PORT', 33507))
app.run(host='0.0.0.0', port=port)
# app.config.from_envvar('FLASKR_SETTINGS')


# app.add_url_rule('/favicon.ico',
#                  redirect_to=url_for('static', filename='favicon.ico'))


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# runs server
if __name__ == '__main__':
    app.run()
