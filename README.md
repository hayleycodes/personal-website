#hayleyavw.com

This is the code behind my personal website.
Uses the Flask microframework.

To run flask:

1. sudo pip install virtualenv
2. . venv/bin/activate
3. pip install Flask
4. export FLASKR_SETTINGS=settings.cfg
5. python flasker.py

To include a database, after step 4:

a. python
b. from flaskr import init_db
c. init_db




If the first steps do not work, then check out [this](http://stackoverflow.com/questions/3843981/how-come-i-can-not-activate-my-virtual-python-environment-with-source-env-bin-a) link.

To update the site:
1. ssh hayleyvanwaas@hayleyavw.com
2. cd into hayleyavw.com
3. git pull origin
4. touch tmp/restart.txt


*Note: Log in leads to presentations, currently only available on local server.*
