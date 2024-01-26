from flask_restx.reqparse import RequestParser
from api import api

def form_hero(form, required=True, location="form"):
    """Formulário de heróis"""
    form.add_argument(
        name="id",
        type=int,
        required=required,
        location=location,
    )
    form.add_argument(
        name="name",
        type=str,
        required=required,
        location=location,
    )
    form.add_argument(
        name="description",
        type=str,
        required=required,
        location=location,
    )
    form.add_argument(
        name="thumbnail",
        type=str,
        required=required,
        location=location,
    )


form_hero_parse = RequestParser()
form_hero(form_hero_parse, required=False)