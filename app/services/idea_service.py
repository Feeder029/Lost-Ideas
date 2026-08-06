from flask import redirect

from app.models.idea import Idea
from app.models.stat import Stat
from app.models.user import User
from app.extensions import db

def create_idea(title, description, difficulty, category, anonymous, user_id):

    idea = Idea(
        title=title,
        description=description,
        category=category,
        difficulty=difficulty,
        anonymous=anonymous,
        user_id=user_id
    )

    try:
        db.session.add(idea)
        db.session.flush()

        stat = Stat(
            user_id=user_id,
            idea_id=idea.id,
            action="shared"
        )

        db.session.add(stat)
        db.session.commit()

        return idea
    except Exception as e:
        db.session.rollback()
        print("ERROR:", e)
        raise e

def adopt_idea(user_id, idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return None

    existing = Stat.query.filter_by(user_id=user_id, idea_id=idea.id, action="adopted").first()

    if existing:
        return False

    stat = Stat(
        user_id=user_id,
        idea_id=idea.id,
        action="adopted"
    )

    db.session.add(stat)
    db.session.commit()

    return True


def delete_idea(user_id, idea_id):
    idea = Idea.query.filter_by(id=idea_id, user_id=user_id).first()

    if idea is None:
        return None

    if idea.user_id != user_id:
        return False

    try:
        db.session.delete(idea)
        db.session.commit()
        return idea
    except Exception as e:
        db.session.rollback()
        print("ERROR:", e)
        raise e