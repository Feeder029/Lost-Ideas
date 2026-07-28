from werkzeug.security import check_password_hash, generate_password_hash
from app.models.user import User
from app.extensions import db

def login_account(email, password):

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return user
    
    return None

def create_account(username, email, password):

    if User.query.filter_by(username=username).first():
        return None
    
    if User.query.filter_by(email=email).first():
        return None

    hashed =  generate_password_hash(password)

    account = User(
        username=username,
        email=email,
        password=hashed
    )

    try:
        db.session.add(account)
        db.session.commit()
        return account
    except Exception as e:
            db.session.rollback()
            print("ERROR:", e)
            raise e