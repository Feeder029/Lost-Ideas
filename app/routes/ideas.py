from flask import Blueprint, redirect, render_template, request, jsonify, session, url_for
from app.models.idea import Idea
from app.models.user import User
from app.services.idea_service import create_idea
from app.extensions import db
from app.utils.helpers import time_ago

idea_bp = Blueprint("ideas", __name__)

@idea_bp.route("/ideas", methods=["GET"])
def get_ideas():
    ideas_data = Idea.query.order_by(Idea.date_created.desc()).all()
    return render_template("main.html", ideas_data=ideas_data)


@idea_bp.route("/ideas", methods=["POST"])
def create():
    user = db.session.get(User, session.get("user_id"))
    
    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))
    
    title = request.form.get("form-title", "").strip()
    description = request.form.get("form-description", "").strip()
    difficulty = request.form.get("form-difficulty")
    category = request.form.get("form-category")
    anonymous = "form-anonymous" in request.form

    idea = create_idea(title, description, difficulty, category, anonymous, user_id=user.id)

    if idea is None:
        return jsonify({"message": "Failed to create idea"}), 500

    return redirect(url_for("paging.main", page="explore"))