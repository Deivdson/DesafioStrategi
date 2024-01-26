from api.models.auth import User
from flask import request, jsonify
from decouple import config
from functools import wraps
import jwt


def jwt_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = None
        current_user = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token:        
            return jsonify({"error": "você não tem permissão para acessar essa rota."}), 403

        if not "Bearer" in token:        
            return jsonify({"error": "token inválido."}), 403

        try:
            token_pure = token.replace("Bearer ", "")
            decoded = jwt.decode(token_pure, config('SECRET_KEY'), algorithms=['HS256'])

            current_user:User = User.query.get(decoded['id'])
        except:
            return jsonify({"error": "O token é inválido"}), 403
        return f(current_user=current_user, *args, **kwargs)
    
    return wrapper
