from flask import Flask

from app.config import Config
from app.extensions import db
from app.routes.ideas import idea_bp
from app.routes.paging import paging_bp
from app.utils.helpers import time_ago

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    app.register_blueprint(idea_bp)
    app.register_blueprint(paging_bp)
    app.jinja_env.filters["time_ago"] = time_ago
    
    with app.app_context():
        db.create_all()

    return app