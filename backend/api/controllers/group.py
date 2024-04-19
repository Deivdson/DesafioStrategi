import json
from flask import Blueprint, request, Response
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from flask_restx import Resource, marshal
from api.utils.validators.hero import validate_heros
from api.models.group import Group
from api.models.hero import Hero
from api.serializers.group_serializer import group_schema, groups_schema, group_serializer
from api.serializers.hero_serializer import hero_schema, heros_schema
from api import db
from api.utils.response.erros import erro_selected_heros
from . import np_grupos

app = Blueprint("grupos", __name__)

class GrupoResource(Resource):
    """Operações relacionadas a grupos"""
    @jwt_required()
    @np_grupos.response(200, 'Sucesso', group_serializer)
    def get(self, id=None):
        user_id = get_jwt_identity().get('id')

        if id:
            groups = Group.query.filter(Group.user_id == user_id, Group.id == id).first()

            if not groups:
                return Response(response=json.dumps({'erros':{'erro': 'Grupo não encontrado.'}}), status=400, content_type="application/json")                
        else:
            groups = Group.query.filter_by(user_id=user_id).all()
        return marshal(groups, group_serializer), 200
    
    @jwt_required()
    @np_grupos.response(200, 'Sucesso', group_serializer)
    @np_grupos.expect(group_serializer)
    def post(self):
        
        user_id = get_jwt_identity().get('id')
        data = request.get_json()
        heros = data.get('integrantes')
        name = data.get('name')
        description = data.get('description') or None
                
        if Group.query.filter_by(name=name).first():
            return Response(response=json.dumps({'errors':{"erro":"O nome já existe"}}), status=400, content_type="application/json")
        
        if validate_heros(heros_list=heros, user_id=user_id):
            return erro_selected_heros()
        
        group:Group = Group(
            name=data.get('name'),
            description=description,
            user_id=user_id,
        )

        if len(heros)>0:
            new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
            group.integrantes = new_heros

        db.session.add(group)
        db.session.commit()
        
        return marshal(group, group_serializer), 200
    
    @jwt_required()
    @np_grupos.response(200, 'Sucesso', group_serializer)
    @np_grupos.expect(group_serializer)
    def put(self, id):
        print("On put")
        user_id = get_jwt_identity().get('id')
        data = request.get_json()
        group:Group = Group.query.get_or_404(id)
            
        group_heros = [gh.id for gh in group.integrantes]        
        
        if validate_heros(data['integrantes'], group_heros, user_id):
            return erro_selected_heros()

        try:
            group.name = data['name']
            group.description = data['description']
            group.user_id = data['user_id']
            heros = data['integrantes']

        except Exception as e:
            return Response(response=json.dumps({"erros": {"erro": f"Dados inválidos! {e}"}}), status=400, content_type="application/json")

        new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
        group.integrantes = new_heros
        db.session.commit()

        return marshal(group, group_serializer), 200

    @jwt_required()
    @np_grupos.response(200, 'Sucesso', group_serializer)
    @np_grupos.expect(group_serializer)
    def patch(self, id):
        user_id = get_jwt_identity().get('id')
        data = request.get_json()
        group:Group = Group.query.get_or_404(id)

        group_heros = [gh.id for gh in group.integrantes]

        if validate_heros(data['integrantes'], group_heros, user_id):
            return erro_selected_heros()

        name =  data.get('user_id') or group.name
        description =  data.get('user_id') or group.description
        userID =  data.get('user_id') or group.user_id
        heros =  data.get('integrantes') or group.integrantes
        try:
            group.name = name
            group.description = description
            group.user_id = userID

        except Exception as e:
            return Response(response=json.dumps({"erros": {"erro": f"Erro Inesperado! {e}"}}), status=400, content_type="application/json")

        new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
        group.integrantes = new_heros
        db.session.commit()
        
        return marshal(group, group_serializer), 200

    @jwt_required()    
    def delete(self, id):
        group = Group.query.get_or_404(id)
        group.delete()
        db.session.commit()
        return Response(response={"response": "OK"}, status=200, content_type="application/json")

np_grupos.add_resource(
    GrupoResource,
    '/',
    methods=['GET', 'POST']
)
np_grupos.add_resource(
    GrupoResource,
    '/<int:id>/',
    methods=['GET', 'PUT', 'PATCH', 'DELETE']
)