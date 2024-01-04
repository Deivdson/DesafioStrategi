import json
from flask import Blueprint, request, Response
from api.models.hero import Hero
from api.serializers.hero_serializer import hero_schema, heros_schema
from api import db

from api.utils.authenticate import jwt_required
from api.utils.service import fetch_api as fetch_api
from api.utils.load_heros import load_heros
from api.utils.execute import heros as heros_execute
from api.utils.paginations import funcs
import asyncio

app = Blueprint("heros", __name__)

@app.route('/', methods=['GET', 'POST'])
@jwt_required
def get_heros(current_user):
    if request.method == "GET":
        args = request.args

        heros = Hero.query.all()
        print('len heros',len(heros))
        if not heros or 'reload' in args:
            load_heros()
            # asyncio.run(calling_function())
            heros = Hero.query.all()
            print(len(heros))

        if 'SEM_GRUPO' in args:
            heros = heros_execute.heros_whitout_group(current_user.id)
        elif 'COM_GRUPO' in args:
            heros = heros_execute.get_heros_with_group(current_user.id)

        if 'offset' in args or 'limit' in args:
            offset = args.get('offset')
            limit = args.get('limit')
            heros = funcs.get_OL(heros, int(offset) if offset else None, int(limit) if limit else None)        

        return Response(response=heros_schema.dumps(heros), status=200, content_type="application/json")
    
    elif request.method == "POST":
        data = request.get_json()

        hero = Hero(
            data.get('id'),
            data.get('name'),
            data.get('description'),
            data.get('thumbnail')
            )
        print(data)
        db.session.add(hero)
        db.session.commit()
        return Response(response=hero_schema.dumps(hero), status=200, content_type="application/json")
    return 'Heros'

@app.route('/<int:id>', methods=['GET', 'DELETE', 'PATCH', 'PUT'])
@jwt_required
def get_hero(current_user, id):
    if request.method == "GET":
        hero = Hero.query.get(id)
        return Response(response=hero_schema.dumps(hero))
    
    if request.method == "PATCH":
        data = request.get_json()
        hero = Hero.query.get(id)        
        hero.name = data.get('name')
        hero.description = data.get('description')
        hero.thumbnail = data.get('thumbnail')
        db.session.commit()
        return Response(response=hero_schema.dumps(hero), status=200, content_type="application/json")
    
    if request.method == "PUT":
        data = request.get_json()
        hero:Hero = Hero.query.get(id)
        
        try:
            hero.name = data['name']
            hero.description = data['description']
            hero.thumbnail = data['thumbnail']

        except Exception as err:
            return Response(response={'erros':{'erro': err}}, status=400, content_type="application/json")

        db.session.commit()
        return Response(response=hero_schema.dumps(hero), status=200, content_type="application/json")

    if request.method == "DELETE":
        hero = Hero.query.get(id)
        db.session.delete(hero)
        db.session.commit()
        return Response(response="OK", status=200)


@app.route('/fetch', methods=['GET'])
def fetch():
    if request.method == "GET":        
        limit = 100
        offset = 0
        data = fetch_api(f'https://gateway.marvel.com/v1/public/characters?limit={limit}&offset={offset}')

        for i in range(9):
            print(i)
            list_heros = []
            for caracter in data:            
                exist = Hero.query.filter_by(name=caracter['name']).first()
                if not exist and caracter:
                    new_hero = {'name':caracter['name'], 'description':caracter['description']}
                    print('-> ',new_hero,'\n')             
                    hero = Hero(name=caracter['name'], description=caracter['description'])
                    
                    list_heros.append(hero)
            offset += limit
                    
        db.session.add_all(list_heros)
        db.session.commit()
        return Response(response=json.dumps(data), status=200)