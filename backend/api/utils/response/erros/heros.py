import json
from flask import request, Response

def erro_selected_heros():
    response = Response(json.dumps({'errors':{"erro":"Os heróis selecionados já fazem parte de um grupo"}}), status=400, content_type="application/json")
    return response