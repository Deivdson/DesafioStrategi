from flask import Blueprint
from api import db, app
from flask_cors import CORS
from api.controllers.auth import app as auth_controller
from api.controllers.hero import app as hero_controller
from api.controllers.group import app as group_controller
from api.models.auth import User

CORS(app)

app.register_blueprint(auth_controller, url_prefix="/auth/")
app.register_blueprint(hero_controller, url_prefix="/hero/")
app.register_blueprint(group_controller, url_prefix="/group/")
app.config['SECRET_KEY'] = 'secret'


@app.route("/")
def homepage():
    return "HomePage"


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
    app.run(host='0.0.0.0', debug=True)