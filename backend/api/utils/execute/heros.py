from api import db
from sqlalchemy import text

def heros_whitout_group(user_id:int):
    sql_query = text(f"""
        SELECT h.id, h.name, h.description, h.thumbnail 
        FROM heros h
        LEFT JOIN group_hero gh ON gh.hero_id = h.id
        WHERE gh.hero_id IS NULL
        OR h.id NOT IN (
            SELECT gh.hero_id
            FROM group_hero gh
            INNER JOIN groups g ON g.id = gh.group_id
            WHERE g.user_id = {user_id}
        )
    """)
    
    result = db.session.execute(sql_query)
    heroes_without_groups = [{"id": row[0], "name": row[1], "description": row[2], "thumbnail": row[3]} for row in result]

    return heroes_without_groups

def get_heros_with_group(user_id:int):
    sql_query = text(f"""
        SELECT h.id, h.name, h.description, h.thumbnail
        FROM heros h
        INNER JOIN group_hero gh ON gh.hero_id = h.id
        INNER JOIN groups g ON g.id = gh.group_id
        WHERE g.user_id = {user_id}
    """)

    result = db.session.execute(sql_query)
    heroes_with_groups = [{"id": row[0], "name": row[1], "description": row[2], "thumbnail": row[3]} for row in result]

    return heroes_with_groups