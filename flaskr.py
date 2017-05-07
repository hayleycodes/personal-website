from flask import Flask, render_template, url_for, send_from_directory
import os
from verto import Verto

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)
# app.config.from_envvar('FLASKR_SETTINGS')



class Converter:
    def __init__(self):
        self.converter = self.setup_converter()

    def setup_converter(self):
        processors = {'heading', 'image'}
        custom_templates = {
            'heading': open('custom_html_templates/heading.html').read()
        }
        return Verto(processors=processors, html_templates=custom_templates)

    def convert_md_file(self, md_file):
        # load md file and convert
        md_content = open(md_file).read()
        return self.converter.convert(md_content).html_string


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
@app.route('/index')
def index():
    converter = Converter()
    about_content = converter.convert_md_file('content/about.md')
    projects_content = converter.convert_md_file('content/projects.md')
    return render_template('index.html', about=about_content, projects=projects_content)

# runs server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.jinja_env.autoescape = False
    app.run(host='0.0.0.0', port=port)
    # app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon.ico'))

    # app.run()
