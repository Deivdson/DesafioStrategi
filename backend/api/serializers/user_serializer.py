from marshmallow import validates, ValidationError, fields, Schema
from api.models.auth import User

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
