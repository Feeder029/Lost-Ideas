from flask import Blueprint, redirect, render_template, request, jsonify, url_for
from app.models.idea import Idea
from app.services.idea_service import create_idea
from app.utils.helpers import time_ago

idea_bp = Blueprint("ideas", __name__)

@idea_bp.route("/ideas", methods=["GET"])
def get_ideas():
    ideas_data = Idea.query.order_by(Idea.date_created.desc()).all()
    return render_template("main.html", ideas_data=ideas_data)


@idea_bp.route("/ideas", methods=["POST"])
def create():
    title = request.form.get("form-title", "").strip()
    description = request.form.get("form-description", "").strip()
    category = request.form.get("form-category")
    difficulty = request.form.get("form-difficulty")

    idea = create_idea(title, description, difficulty, category)

    if idea is None:
        return jsonify({"message": "Failed to create idea"}), 500

    return redirect(url_for("paging.main", page="explore"))