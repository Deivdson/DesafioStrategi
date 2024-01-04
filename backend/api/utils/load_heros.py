from flask import Blueprint, request, Response
from api.utils.authenticate import jwt_required
from api.models.hero import Hero
from api.serializers.hero_serializer import hero_schema, heros_schema
from api import db
from api.utils.service import fetch_api as fetch_api


def load_heros():
    limit = 100
    offset = 0
    print('load heros...')
    for i in range(16):
        data = fetch_api(f'https://gateway.marvel.com/v1/public/characters?limit={limit}&offset={offset}')
        print(i, limit, offset)
        list_heros = []
        for caracter in data:            
            exist = Hero.query.filter_by(name=caracter['name']).first()
            print(caracter, '\n\n')
            if not exist and caracter:             
                hero = Hero(id=caracter.get('id'), name=caracter.get('name'), description=caracter.get('description'), thumbnail=caracter.get('thumbnail').get('path'))
                list_heros.append(hero)
        offset += limit
        print('offset: ', offset, 'limit: ', limit)
            
    db.session.add_all(list_heros)
    db.session.commit()

