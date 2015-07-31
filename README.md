#[hayleyavw.com](http://www.hayleyavw.com)

This is the code behind my personal website.
Uses the Flask microframework, and Foundation for the responsive design.

To run flask:

1. sudo pip install virtualenv
2. virtualenv venv
3. . venv/bin/activate #start the virtual environment #NOTE: if this does not work, try: . ENV/bin/activate
4. pip install Flask
5. export FLASKR_SETTINGS=settings.cfg #tells the application where to find the settings (username, password etc)
6. python
7. from flaskr import init_db  
8. init_db #initialises the database
9. python flasker.py #starts the server

If the first steps do not work, then check out [this](http://stackoverflow.com/questions/3843981/how-come-i-can-not-
activate-my-virtual-python-environment-with-source-env-bin-a) link.

The site uses SASS for styling:

1. cd into the static/ folder
2. compass install compass --sass-dir "sass" --css-dir "stylesheets" --javascripts-dir "js" --images-dir "images" #makes sure the right files are watched, and that the output file is put in a separate folder
3. compass watch



To update the site:

1. ssh hayleyvanwaas@hayleyavw.com
2. cd into hayleyavw.com
3. git pull origin
4. touch tmp/restart.txt