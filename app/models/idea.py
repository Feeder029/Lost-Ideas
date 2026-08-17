from datetime import datetime
from app.extensions import db

class Idea(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    category = db.Column(db.Text)
    difficulty = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    anonymous = db.Column(db.Boolean, default=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", back_populates="ideas")
    stats = db.relationship("Stat", back_populates="idea", cascade="all, delete-orphan")