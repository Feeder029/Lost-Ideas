from flask import Blueprint, make_response, redirect, render_template, jsonify, session, url_for

from app.models.idea import Idea
from app.models.user import User
from app.extensions import db
from app.services.stats_service import get_profile_stats
from app.utils.helpers import get_category_icon

paging_bp = Blueprint("paging", __name__)

@paging_bp.route("/")
def home():
    return render_template("index.html")

@paging_bp.route("/main/<page>")
def main(page):
    protected_pages = {"profile", "about"}

    user = None
    stats = None

    if page in protected_pages:
        user = db.session.get(User, session.get("user_id"))

        if user is None:
            session.pop("user_id", None)
            return redirect(url_for("auth.login"))

        if page == "profile":
            stats = get_profile_stats(user.id)

    ideas_data = Idea.query.order_by(Idea.date_created.desc()).all()

    response = make_response(
        render_template(
            "main.html",
            page=page,
            ideas_data=ideas_data,
            get_category_icon=get_category_icon,
            user=user,
            stats=stats
        )
    )

    if page in protected_pages:
        response.headers["Cache-Control"] = (
            "no-store, no-cache, must-revalidate, max-age=0"
        )
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

    return response

@paging_bp.route("/explore")
def explore():
    user = db.session.get(User, session.get("user_id"))
    
    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))
    
    return render_template("explore.html")

@paging_bp.route("/profile")
def profile():
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    return render_template("profile.html", user=user)

@paging_bp.route("/nav")
def nav():
    return render_template("/components/navbar.html")

@paging_bp.route("/footer")
def footer():
    return render_template("footer.html")

@paging_bp.route("/auth")
def auth():
    return render_template("auth.html")
