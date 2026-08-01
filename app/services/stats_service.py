from app.models.stat import Stat

def get_profile_stats(user_id):
    ideas_shared = Stat.query.filter_by(user_id=user_id, action="shared").count()
    ideas_adopted = Stat.query.filter_by(user_id=user_id, action="adopted").count()
    ideas_built = Stat.query.filter_by(user_id=user_id, action="built").count()

    return {
        "ideas_shared": ideas_shared,
        "ideas_adopted": ideas_adopted,
        "ideas_built": ideas_built
    }

def get_requested_ideas(user_id, action):
    requested_ideas = Stat.query.filter_by(user_id=user_id, action=action).all()
    return requested_ideas