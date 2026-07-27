from flask import Blueprint, render_template, request, jsonify
from app.services.idea_service import create_idea

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

        return jsonify({
            "message": "Idea Created",
            "id": idea.id,
            "title": idea.title,
            "desc": idea.description,
            "category": idea.category,
            "diff": idea.difficulty,
            "date_created": idea.date_created
        })