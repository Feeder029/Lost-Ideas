from flask import Blueprint, jsonify, render_template, redirect, url_for, session

from app.extensions import db
from app.models import stat
from app.models.user import User
from app.services.stats_service import get_profile_stats, get_requested_ideas
from app.utils.helpers import time_ago

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/stats")
def profile_stats():
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    stats = get_profile_stats(user.id)

    return render_template("profile.html", user=user, stats=stats)

@stats_bp.route("/requested_ideas/<string:action>", methods=["GET"])
def requested_ideas(action):
    user = db.session.get(User, session.get("user_id"))
    
    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    requested_ideas = get_requested_ideas(user.id, action)

    return jsonify([
        {
            "id": stat.idea.id,
            "title": stat.idea.title,
            "description": stat.idea.description,
            "difficulty": stat.idea.difficulty,
            "category": stat.idea.category,
            "date_created": time_ago(stat.idea.date_created)
        }
        for stat in requested_ideas
    ])

@stats_bp.route("/new_stats", methods=["GET"])
def new_stats():
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        return "", 401

    return jsonify(get_profile_stats(user.id))