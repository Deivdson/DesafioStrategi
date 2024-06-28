from flask import Blueprint
from api import db, app, api
from flask_cors import CORS
from api.controllers.auth import app as auth_controller
from api.controllers.group import app as group_controller
from api.controllers.hero import app as hero_controller
from api.models.auth import User
from flask_jwt_extended import (JWTManager)
from datetime import timedelta

CORS(app)

app.config['SECRET_KEY'] = 'secret'
app.config["JWT_SECRET_KEY"] = "asmdkamsjfnmamsmsdmsaakmfmfmaskmkfaskd"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

# app.register_blueprint(api)

@app.shell_context_processor
def make_shell_context():
    return dict(
        app=app,
        db=db,
        User=User
    )

main = Blueprint('main', __name__)

if __name__ == '__main__':
    with app.test_request_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True, ssl_context=('cert.pem', ))