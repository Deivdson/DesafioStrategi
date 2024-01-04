from api import ma, db
from api.models.group import Group
from api.serializers.hero_serializer import hero_schema

class GroupSchema(ma.Schema):
    """Serializer Groups"""
    integrantes = ma.Nested(hero_schema, many=True)
    class Meta:
        """Class Meta"""
        fields = ("id", "name", "description", "user_id", "integrantes")

group_schema = GroupSchema()
groups_schema = GroupSchema(many=True)
