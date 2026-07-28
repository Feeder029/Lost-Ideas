from flask import Blueprint, redirect, render_template, request, jsonify, url_for
from app.models.idea import Idea
from app.services.idea_service import create_idea
from app.utils.helpers import time_ago

idea_bp = Blueprint("ideas", __name__)

@idea_bp.route("/ideas", methods=['POST', 'GET'])
def ideas():

    if request.method == "POST":
        title = request.form.get('form-title')
        description = request.form.get('form-description')
        category = request.form.get('form-category')
        difficulty = request.form.get('form-difficulty')
    
        idea = create_idea(title, description, difficulty, category)
    
        if idea is None:
            return jsonify({
                "message": "Failed to create idea"
            }), 500

        return redirect(url_for("paging.main", page="explore"))
    else:
        ideas_data = Idea.query.order_by(Idea.date_created).all()
        return render_template("main.html", ideas_data=ideas_data)