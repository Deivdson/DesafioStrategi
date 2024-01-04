from flask import Blueprint, request, Response
from api import db
from api.models.auth import User
from flask import jsonify
import json, datetime, jwt
from api.serializers.user_serializer import user_share_schema
from decouple import config
import api

app = Blueprint("auth", __name__)

@app.route('/register', methods=["POST"])
def register():    
    if request.method == 'POST':
        username =  request.json['username']
        nome =      request.json['name']
        email =     request.json['email']
        password =  request.json['password']
        user = User(
            username,password,nome,email
        )
        db.session.add(user)
        db.session.commit()
       
        return Response(response=json.dumps({'status':'success', 'data':user_share_schema.dump(user)}), status=200, content_type="application/json")        

@app.route('/', methods=["POST"])
def login():    
    email = request.json['email']
    password = request.json['password']

    user:User = User.query.filter_by(email=email).first_or_404()

    if not user.verify_password(password):
        return jsonify({
            "error": "suas credênciais estão erradas!"
        }), 403
    payload = {
        "id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=20),        
    }

    token = jwt.encode(payload, config('SECRET_KEY'), algorithm='HS256')
    return jsonify({"token":token,"user":{
            "email":user.email,
            "username":user.username,
            "name":user.name
        }})
