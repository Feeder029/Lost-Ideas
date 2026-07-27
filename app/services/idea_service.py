from flask import redirect

from app.models.idea import Idea
from app.models.user import User
from app.extensions import db

def create_idea(title, description, difficulty, category):

    idea = Idea(
        title=title,
        description=description,
        category=category,
        difficulty=difficulty
    )

    try:
        db.session.add(idea)
        db.session.commit()
        return idea
    except Exception as e:
        db.session.rollback()
        print("ERROR:", e)
        raise e
