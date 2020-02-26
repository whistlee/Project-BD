import os
import connexion
import psycopg2

basedir = os.path.abspath(os.path.dirname(__file__))
# Create the application instance
connex_app = connexion.App(__name__, specification_dir=basedir)
app = connex_app.app

connection = psycopg2.connect(database="bdproj", user="postgres", password="Kamil280897.", host="127.0.0.1",
                              port="5432")
cur = connection.cursor()
