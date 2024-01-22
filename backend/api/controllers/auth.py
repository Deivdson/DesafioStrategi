from flask import Blueprint, request, Response
from flask import jsonify
from flask_jwt_extended import (create_access_token)
from flask_restx import Resource, marshal
from api import db
from api.models.auth import User
from api.serializers.user_serializer import (
    user_share_schema,
    register_serializer, 
    login_serializer, 
    auth_response_serializer, 
    user_serializer
    )
from api.serializers.responses_serializer import response_register
from api.serializers.errors_serializer import response_error, error_serializer
from sqlalchemy.exc import IntegrityError
from . import np_auth

app = Blueprint("auth", __name__)

class RegisterResource(Resource):
    """Registro"""    
    
    @np_auth.response(200, 'Sucesso', user_serializer)
    @np_auth.expect(register_serializer)
    def post(self):

        try:
            username =  request.json['username']
            nome =      request.json['name']
            email =     request.json['email']
            password =  request.json['password']
            user:User = User(
                username,password,nome,email
            )
            
            db.session.add(user)
            db.session.commit()
        except IntegrityError as e:
            return response_error(
                "O email ou username Já existem",
                {"erro":e},
                400
            )

        return response_register('success', user_serializer, user)        

class LoginResource(Resource):
    """Login"""
    
    @np_auth.response(200, 'Sucesso', auth_response_serializer)
    @np_auth.response(400, 'Falha', error_serializer)
    @np_auth.expect(login_serializer)
    def post(self):
        email = request.json['email']
        password = request.json['password']

        user:User = User.query.filter_by(email=email).first_or_404()

        if not user.verify_password(password):
            return response_error(
                "Verifique novamente as informações de login!",
                {"erro": "Credenciais Incorretas"},
                400
            )

        acess_token = create_access_token(identity={"id":user.id})
        
        return marshal(
            {"token":acess_token,
             "user":{
                "email":user.email,
                "username":user.username,
                "name":user.name
            }},
            auth_response_serializer
        ), 200


np_auth.add_resource(
    LoginResource,
    '/',
    methods=['POST']
)

np_auth.add_resource(
    RegisterResource,
    '/register',
    methods=['POST']
)