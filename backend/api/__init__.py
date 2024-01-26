from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_restx import Api

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = 'secret'
# CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

api = Api(version='1.0', title="API HEROES", description='API de gerenciamento de heróis')
api.init_app(app)
