from app.models.idea import Idea

def get_profile_stats(user_id):
    # ideas_shared = Idea.query.filter_by(user_id=user_id).count()
    # ideas_adopted = Idea.query.filter_by(adopted_by=user_id).count()
    # ideas_built = Idea.query.filter_by(adopted_by=user_id,is_built=True).count()

    # return {
    #     "ideas_shared": ideas_shared,
    #     "ideas_adopted": ideas_adopted,
    #     "ideas_built": ideas_built
    # }

    return {
        "ideas_shared": Idea.query.filter_by(user_id=user_id).count(),
        "ideas_adopted": 0,
        "ideas_built": 0,
    }