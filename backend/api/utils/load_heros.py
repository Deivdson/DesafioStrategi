from flask import Blueprint, request, Response
from api.utils.authenticate import jwt_required
from api.models.hero import Hero
from api.serializers.hero_serializer import hero_schema, heros_schema
from api import db
from api.utils.service import fetch_api as fetch_api


def load_heros():
    limit = 100
    offset = 0
    print('load heros')
    for i in range(9):
        data = fetch_api(f'https://gateway.marvel.com/v1/public/characters?limit={limit}&offset={offset}')
        print(i)   
        list_heros = []
        for caracter in data:            
            exist = Hero.query.filter_by(name=caracter['name']).first()
            if not exist and caracter:
                new_hero = {'name':caracter['name'], 'description':caracter['description'], 'thumbnail':caracter['thumbnail'].get('path')}
                print('-> ',new_hero,'\n')
                hero = Hero(id=caracter['id'], name=caracter['name'], description=caracter['description'], thumbnail=caracter['thumbnail'].get('path'))
                list_heros.append(hero)
        offset += limit
            
    db.session.add_all(list_heros)
    db.session.commit()