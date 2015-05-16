#hayleyavw.com

This is the code behind my personal website.
Uses the Flask microframework, and Foundation for the responsive design.

To run flask:

1. sudo pip install virtualenv
2. . venv/bin/activate #start the virtual environment #NOTE: if this does not work, try: . ENV/bin/activate
3. pip install Flask
4. export FLASKR_SETTINGS=settings.cfg #tells the application where to find the settings (username, password etc)
5. python
6. from flaskr import init_db  
7. init_db #initialises the database
8. python flasker.py #starts the server


If the first steps do not work, then check out [this](http://stackoverflow.com/questions/3843981/how-come-i-can-not-activate-my-virtual-python-environment-with-source-env-bin-a) link.

To update the site:

1. ssh hayleyvanwaas@hayleyavw.com
2. cd into hayleyavw.com
3. git pull origin
4. touch tmp/restart.txt