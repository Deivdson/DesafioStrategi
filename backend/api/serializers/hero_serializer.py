from api import ma, db
from api.models.hero import Hero

class HeroSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "description", "thumbnail")
    
hero_schema = HeroSchema()
heros_schema = HeroSchema(many=True)
