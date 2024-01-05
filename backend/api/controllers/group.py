import json
from flask import Blueprint, request, Response
from api.utils.authenticate import jwt_required
from api.utils.validators.hero import validate_heros
from api.models.group import Group
from api.models.hero import Hero
from api.serializers.group_serializer import group_schema, groups_schema
from api.serializers.hero_serializer import hero_schema, heros_schema
from api import db

app = Blueprint("groups", __name__)

@app.route('/', methods=['GET', 'POST'])
@jwt_required
def get_groups(current_user):

    if request.method == "GET":
        groups = Group.query.all()
        return Response(response=groups_schema.dumps(groups), status=200, content_type="application/json")

    elif request.method == "POST":
        data = request.get_json()
        heros = data.get('heros')
        name = data.get('name')
        description = data.get('description') or None
                
        if Group.query.filter_by(name=name).first():
            return Response(response=json.dumps({'errors':{"erro":"O nome já existe"}}), status=400, content_type="application/json")
        
        if validate_heros(heros_list=heros, user_id=current_user.id):            
            return Response(response=json.dumps({'errors':{"erro":"Os heróis selecionados já fazem parte de um grupo"}}), status=400, content_type="application/json")
        
        group:Group = Group(
            name=data.get('name'),
            description=description,
            user_id=current_user.id,
        )

        if len(heros)>0:
            new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
            group.integrantes = new_heros

        db.session.add(group)
        db.session.commit()

        response = {group_schema.dumps(group)}        
        return Response(response=response, status=200, content_type="application/json")

@app.route('/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required
def get_group(current_user, id):
    if request.method == "GET":
        group = Group.query.get_or_404(id)
        return Response(response=group_schema.dumps(group), status=200, content_type="application/json")

    elif request.method == "DELETE":
        group = Group.query.get(id)
        group.delete()
        db.session.commit()
        return Response(response={"response": "OK"}, status=200, content_type="application/json")

    elif request.method == "PUT":
        data = request.get_json()
        group:Group = Group.query.get(id)
            
        group_heros = [gh.id for gh in group.integrantes]

        print(group_heros)
        
        if validate_heros(data['heros'], group_heros, current_user.id):
            return Response(response=json.dumps({'errors':{"erro":"Os heróis selecionados já fazem parte de um grupo"}}), status=400, content_type="application/json")

        try:
            group.name = data['name']
            group.description = data['description']
            heros = data['heros']

        except Exception as e:
            return Response(response={"erros": {"erro": f"Dados inválidos! {e}"}}, status=400, content_type="application/json")
                
        new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
        group.integrantes = new_heros
        db.session.commit()

        return Response(response=group_schema.dumps(group), status=200, content_type="application/json")
    
    elif request.method == "PATCH":
        data = request.get_json()
        group:Group = Group.query.get(id)

        group_heros = [gh.id for gh in group.integrantes]

        if validate_heros(data['heros'], group_heros, current_user.id):
            return Response(response=json.dumps({'errors':{"erro":"Os heróis selecionados já fazem parte de um grupo"}}), status=400, content_type="application/json")

        try:
            group.name = data.get('name')
            group.description = data.get('description')
            heros = data.get('heros')

        except Exception as e:
            return Response(response={"erros": {"erro": f"Dados inválidos! {e}"}}, status=400, content_type="application/json")

        new_heros = Hero.query.filter(Hero.id.in_(heros)).all()
        group.integrantes = new_heros
        db.session.commit()

        response = {"grupo":group_schema.dumps(group), "hero": heros_schema.dumps(heros)}
        return Response(response=response, status=200, content_type="application/json")
