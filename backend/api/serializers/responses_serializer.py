from flask_restx import fields, marshal
from api import api


def response_register(message, serializer, data, status=200):
    response_serializer = api.model(
        "ResponseError",
        {
            "status": fields.String,
            "data": fields.Nested(serializer),
        }
    )
    return marshal(
        {"status": message, "data": data}, response_serializer
    ), status
