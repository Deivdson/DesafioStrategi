from api import api
import importlib

np_auth = api.namespace(
    "auth",
    description="Rotas de autenticação"
)

np_grupos = api.namespace(
    "grupos",
description="Rotas de gerenciamento de grupos"
)

np_herois = api.namespace(
    "herois",
    description="Rotas de gerenciamento de herois"
)
importlib.import_module("api.controllers.hero")