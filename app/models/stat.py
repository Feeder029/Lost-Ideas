from app.extensions import db

class Stat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    idea_id = db.Column(db.Integer, db.ForeignKey("idea.id"), nullable=False)

    user = db.relationship("User", back_populates="stats")
    idea = db.relationship("Idea", back_populates="stats")