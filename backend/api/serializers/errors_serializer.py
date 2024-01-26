from flask_restx import fields, marshal
from api import api

error_serializer = api.model(
    "ResponseError",
    {
        "message": fields.String,
        "errors": fields.Raw,
    }
)

def response_error(message, error, status=400):
    return marshal(
        {"message": message, "error": error}, error_serializer
    ), status
