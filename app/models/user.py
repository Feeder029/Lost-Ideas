from app.extensions import db

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    nickname = db.Column(db.String(50), unique=True)

    email = db.Column(db.String(120), unique=True)

    password = db.Column(db.String(255))