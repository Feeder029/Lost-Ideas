from flask import Flask, session
from dotenv import load_dotenv

from app.config import Config
from app.extensions import db

from app.models.user import User
from app.models.idea import Idea
from app.models.stat import Stat

from app.routes.ideas import idea_bp
from app.routes.paging import paging_bp
from app.routes.stats import stats_bp
from app.routes.auth import auth_bp

from app.utils.helpers import get_initials, time_ago

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    @app.context_processor
    def inject_user():
        user = None

        if "user_id" in session:
            user = db.session.get(User, session["user_id"])

            if user is None:
                session.pop("user_id", None)

        return {"current_user": user}

    app.register_blueprint(idea_bp)
    app.register_blueprint(paging_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(stats_bp)

    app.jinja_env.filters["time_ago"] = time_ago
    app.jinja_env.globals["get_initials"] = get_initials
    
    with app.app_context():
        db.create_all()

    return app