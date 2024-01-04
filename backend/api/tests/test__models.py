# pylint: skip-file
from  api.models import auth, group, hero

def test_create_auth():
    auth_x = auth.User('username','senha123', 'name', 'email@mail.com')

    assert(
          auth_x.username == 'username' and          
          auth_x.name == 'name' and
          auth_x.email == 'email@mail.com'
          )

def test_create_group():
    group_x = group.Group('name', 'description', '1')

    assert(
        group_x.name == 'name' and
        group_x.description == 'description' and
        group_x.user_id == '1'
    )

def test_create_hero():
    hero_x = hero.Hero('1', 'name', 'description', 'thumbnail')

    assert(
        hero_x.id == '1' and
        hero_x.name == 'name' and
        hero_x.description == 'description' and
        hero_x.thumbnail == 'thumbnail'
    )
