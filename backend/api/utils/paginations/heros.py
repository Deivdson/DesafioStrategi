from flask import request
from api.serializers.hero_serializer import heros_schema
from api.models.hero import Hero
from api.models.group import group_hero, Group
from api import db

def get_paginated_heros(heros, page, per_page):
    # heroes_query = db.session.query(Hero).join(group_hero).join(Group).filter(Group.user_id == user_id)
    # paginated_heroes = heroes_query.paginate(page=page, per_page=per_page, error_out=False)
    Hero.query.paginate

    paginated_heroes = heros.paginate(page=page, per_page=per_page, error_out=False)

    heroes = paginated_heroes.items
    total_items = paginated_heroes.total
    current_page = paginated_heroes.page
    per_page = paginated_heroes.per_page
    total_pages = paginated_heroes.pages

    response = {
        # 'heroes': [hero.to_dict() for hero in heroes],
        'heroes': heros_schema.dumps(heroes),
        'total_items': total_items,
        'current_page': current_page,
        'per_page': per_page,
        'total_pages': total_pages
    }

    return response

# Exemplo de uso:
# user_id = 1  # Substitua pelo ID do usuário desejado
# page = request.args.get('page', 1, type=int)  # Parâmetro opcional, padrão é 1
# per_page = request.args.get('per_page', 10, type=int)  # Parâmetro opcional, padrão é 10

# result = get_paginated_heroes(page, per_page, user_id)
# print(result)
