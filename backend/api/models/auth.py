from werkzeug.security import generate_password_hash, check_password_hash
from api import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)

    def __init__(self, username, password, name, email):
        self.username = username
        self.password =  generate_password_hash(password) 
        self.name = name
        self.email = email

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return "<User %r>" % self.username
    
    def to_dict(self, columns=[]):
        if not columns:
            return {"id":self.id, "username":self.username, "password":self.password, "nome":self.name, "email":self.email}
        else:
            return{col:getattr(self, col) for col in columns}
