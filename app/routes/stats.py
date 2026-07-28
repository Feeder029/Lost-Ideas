from flask import Blueprint, render_template, redirect, url_for, session

from app.extensions import db
from app.models.user import User
from app.services.stats_service import get_profile_stats

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/stats")
def profile_stats():
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    stats = get_profile_stats(user.id)

    return render_template("profile.html", user=user, stats=stats)