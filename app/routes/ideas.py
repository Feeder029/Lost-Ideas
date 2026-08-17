from flask import Blueprint, redirect, render_template, request, jsonify, session, url_for
from app.models.idea import Idea
from app.models.user import User
from app.services.idea_service import adopt_idea, create_idea, delete_idea, edit_idea
from app.extensions import db
from app.utils.helpers import time_ago

idea_bp = Blueprint("ideas", __name__)

@idea_bp.route("/ideas", methods=["GET"])
def get_ideas():
    ideas_data = Idea.query.order_by(Idea.date_created.desc()).all()
    return render_template("main.html", ideas_data=ideas_data)


@idea_bp.route("/share", methods=["POST"])
def share():
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

@idea_bp.route("/adopt", methods=["POST"])
def adopt():
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    idea_id = request.form.get("idea_id")

    if not idea_id or not idea_id.isdigit():
        return "Invalid idea", 400
    
    idea = adopt_idea(user.id, idea_id)

    if idea is None:
        return "Idea not found", 404

    if idea is False:
        return redirect(url_for("paging.main", page="explore"))

    return redirect(url_for("paging.main", page="explore"))

    
@idea_bp.route("/delete/<int:idea_id>", methods=["POST"])
def delete(idea_id):
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    deleted_idea = delete_idea(user.id, idea_id)

    if not deleted_idea:
        return "Failed to delete idea", 500

    return "", 204

@idea_bp.route('/edit/<int:idea_id>', methods=["GET", "POST"])
def edit(idea_id):
    user = db.session.get(User, session.get("user_id"))

    if user is None:
        session.pop("user_id", None)
        return redirect(url_for("auth.login"))

    idea = Idea.query.get(idea_id)

    if idea is None or idea.user_id != user.id:
        return "Idea not found or unauthorized", 404

    title = request.form.get("form-title", "").strip()
    description = request.form.get("form-description", "").strip()
    difficulty = request.form.get("form-difficulty")
    category = request.form.get("form-category")
    anonymous = "form-anonymous" in request.form

    edited_idea = edit_idea(user.id, idea_id, title, description, difficulty, category, anonymous)

    if edited_idea is None:
        return "Failed to edit idea", 500

    # return jsonify({
    #     "id": edited_idea.id,
    #     "title": edited_idea.title,
    #     "description": edited_idea.description,
    #     "difficulty": edited_idea.difficulty,
    #     "category": edited_idea.category,
    #     "anonymous": edited_idea.anonymous,
    #     "date_updated": edited_idea.date_updated.timestamp(),
    # })

    return redirect(url_for("paging.main", page="profile"))

@idea_bp.route('/view')
def view():
    idea_id = request.args.get("idea_id")

    if not idea_id or not idea_id.isdigit():
        return "Invalid idea", 400

    idea = Idea.query.get(idea_id)

    if idea is None:
        return "Idea not found", 404

    time_ago_str = time_ago(idea.date_created)

    return render_template("view_idea.html", idea=idea, time_ago=time_ago_str)