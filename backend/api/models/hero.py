from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON
from api import db, ma

class Hero(db.Model):
    __tablename__='heros'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)    
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)
    thumbnail = db.Column(db.String, nullable=True)    

    def __init__(self, name, description, thumbnail ):        
        self.name = name
        self.description = description
        self.thumbnail = thumbnail

    def to_dict(self, columns=[]):
        if not columns:
            return {"id":self.id, "name":self.name, "descrição":self.description}
        else:
            return{col:getattr(self, col) for col in columns}