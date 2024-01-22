import json
from flask import request, Response
from flask_restx import Resource, marshal
from flask_jwt_extended import (jwt_required, get_jwt_identity)

from api.models.hero import Hero
from api.utils.service import fetch_api as fetch_api
from api.utils.load_heros import load_heros
from api.utils.execute import heros as heros_execute
from api.utils.paginations import funcs

from api.serializers.hero_serializer import hero_schema, heros_schema
from api.serializers.hero_serializer import hero_serializer
from api.serializers.errors_serializer import response_error, error_serializer

from api.forms.form_hero import form_hero_parse
from api import db
from . import np_herois


class HeroiResource(Resource):
    """Operações relacionadas a heróis"""

    @jwt_required()
    @np_herois.response(200, 'Sucesso', hero_serializer)
    def get(self, id=None):
        try:
            if id:
                hero = Hero.query.get(id)
                if hero:
                    return marshal(hero, hero_serializer), 200
                else:
                    return Response(response=json.dumps({'erros':{'erro': 'Herói não encontrado.'}}), status=400, content_type="application/json")
            else:
                args = request.args
                heros = Hero.query.all()

                if not heros or 'reload' in args:
                    load_heros()
                    heros = Hero.query.all()
                    print(len(heros))

                user_id = get_jwt_identity().get('id')

                if 'SEM_GRUPO' in args:
                    heros = heros_execute.heros_whitout_group(user_id)
                elif 'COM_GRUPO' in args:
                    heros = heros_execute.get_heros_with_group(user_id)

                if 'offset' in args or 'limit' in args:
                    offset = args.get('offset')
                    limit = args.get('limit')
                    heros = funcs.get_OL(heros, int(offset) if offset else None, int(limit) if limit else None)

                return marshal(heros, hero_serializer), 200
        except Exception as e:
            raise e

    @jwt_required()
    @np_herois.response(200, 'Sucesso', hero_serializer)
    @np_herois.expect(hero_serializer)
    def post(self):
        validated_data = hero_schema.load(request.get_json())

        h = Hero.query.get(validated_data.get('id'))
        if h:
            return Response(response=json.dumps({'erros':{'erro': "Herói já cadastrado!"}}), status=400, content_type="application/json")

        hero = Hero(**validated_data)

        db.session.add(hero)
        db.session.commit()

        return marshal(hero, hero_serializer), 200
    
    @np_herois.response(200, 'Sucesso', hero_serializer)
    @np_herois.expect(hero_serializer)
    @jwt_required()
    def put(self, id):
        data = hero_schema.load(request.get_json())
        hero:Hero = Hero.query.get(id)

        if not hero:
            return Response(response=json.dumps({'erros':{'erro': 'Herói não encontrado.'}}), status=400, content_type="application/json")
        else:                
            try:
                hero.name = data['name']
                hero.description = data['description']
                hero.thumbnail = data['thumbnail']

            except Exception as err:
                return response_error("Erro Inesperado!", {'erro': err})

            db.session.commit()

            return marshal(hero, hero_serializer), 200

    @np_herois.response(200, 'Sucesso', hero_serializer)
    @np_herois.expect(hero_serializer)
    @jwt_required()
    def patch(self, id):
        data = hero_schema.load(request.get_json())

        hero:Hero = Hero.query.get(id)
        if not hero:
            return Response(response=json.dumps({'erros':{'erro': 'Herói não encontrado.'}}), status=400, content_type="application/json")
        else:
            name = data.get('name') or hero.name
            description = data.get('description') or hero.description
            thumbnail = data.get('thumbnail') or hero.thumbnail
            try:
                hero.name = name
                hero.description = description
                hero.thumbnail = thumbnail
                
            except Exception as e:
                return response_error("Erro Inesperado!", {'erro': err})

            db.session.commit()
            return marshal(hero, hero_serializer), 200

    @jwt_required()
    def delete(self, id):
        hero = Hero.query.get(id)
        if not hero:
            return Response(response=json.dumps({'erros':{'erro': 'Herói não encontrado.'}}), status=400, content_type="application/json")
        else:
            db.session.delete(hero)
            db.session.commit()

            return Response(response="OK", status=200)
    

np_herois.add_resource(
    HeroiResource,
    '/',
    methods=['GET', 'POST']
)

np_herois.add_resource(
    HeroiResource,
    '/<int:id>/',
    methods=['GET', 'PUT', 'PATCH', 'DELETE']
)