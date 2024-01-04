from flask_sqlalchemy import SQLAlchemy
from api import db, ma
from .hero import Hero

group_hero = db.Table('group_hero',          
            db.Column('group_id', db.Integer, db.ForeignKey('groups.id')),
            db.Column('hero_id', db.Integer, db.ForeignKey('heros.id'))
            )

class Group(db.Model):
    __tablename__='groups'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', foreign_keys=user_id)

    integrantes = db.relationship("Hero", secondary=group_hero, backref='groups')

    def __init__(self, name, description, user_id):
        self.name = name
        self.description = description
        self.user_id = user_id        

