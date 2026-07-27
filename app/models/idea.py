from datetime import datetime
from app.extensions import db

class Idea(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    category = db.Column(db.Text)
    difficulty = db.Column(db.Text)

    date_created = db.Column(
        db.DateTime, 
        default=datetime.utcnow
    )
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id")
    )