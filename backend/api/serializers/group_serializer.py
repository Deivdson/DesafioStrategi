from api import ma, db
from api.models.group import Group
from api.serializers.hero_serializer import hero_schema, hero_serializer
from flask_restx import fields
from api import api

class GroupSchema(ma.Schema):
    """Serializer Groups"""
    integrantes = ma.Nested(hero_schema, many=True)
    class Meta:
        """Class Meta"""
        fields = ("id", "name", "description", "user_id", "integrantes")

group_schema = GroupSchema()
groups_schema = GroupSchema(many=True)

group_serializer = api.model(
    "Grupo",
    {
        "id": fields.Integer(description="ID do grupo"),
        "name": fields.String(description="Nome do grupo"),
        "description": fields.String(description="Descrição do grupo"),
        "user_id": fields.Integer(description="ID do usuário"),
        "integrantes": fields.Nested(hero_serializer)
    }
)

