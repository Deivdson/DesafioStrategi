from api import ma, db
from api.models.hero import Hero

from flask_restx import fields
from api import api

class HeroSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "description", "thumbnail")
    
hero_schema = HeroSchema()
heros_schema = HeroSchema(many=True)



hero_serializer = api.model(
    "Herói",
    {
        "id": fields.Integer(description="ID do herói"),
        "name": fields.String(description="Nome do heróis"),
        "description": fields.String(description="Descrição do herói"),
        "thumbnail": fields.String(description="Url imagem do herói")
    }
)
