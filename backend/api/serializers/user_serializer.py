from marshmallow import validates, ValidationError, fields, Schema
from api.models.auth import User

from flask_restx import fields
from api import api

class UserSchema(Schema):
    password = fields.String()
    class Meta:
        fields = ('username', 'name', 'email')

    @validates("password")
    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("A senha deve ser maior que 8 caracteres")
        if not any(c.isupper() for c in value):
            raise ValidationError("Deve ter pelo menos um caractere Maiúsculo")
        if not any(c.islower() for c in value):
            raise ValidationError("Deve ter pelo menos um caractere Minúsculo")

user_share_schema = UserSchema()
users_share_schema = UserSchema(many=True)

register_serializer = api.model(
    "Auth Register",
    {
        "username": fields.String(description="Nome de usuário"),
        "name": fields.String(description="Nome completo ou parcial"),
        "email": fields.String(description="E-mail para contato"),
        "password": fields.String(description="Senha do usuário")
    }
)

login_serializer = api.model(
    "Auth Login",
    {
        "email": fields.String(description="E-mail para contato"),
        "password": fields.String(description="Senha do usuário")
    }
)

user_serializer = api.model(
    "Auth",
    {
        "username": fields.String(description="Nome de usuário"),
        "name": fields.String(description="Nome completo ou parcial"),
        "email": fields.String(description="E-mail para contato"),
    }
)

auth_response_serializer = api.model(
    "Login Response",
    {
        "token": fields.String(description="Token de acesso"),
        "user": fields.Nested(user_serializer)
    }

)