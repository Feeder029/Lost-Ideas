from flask import Blueprint, redirect, render_template, request, session, url_for
from app.services.auth_service import create_account, login_account

auth_bp = Blueprint ("auth", __name__)

@auth_bp.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        email = request.form.get("form-login-email")
        password = request.form.get("form-login-password")

        user = login_account(email, password)

        if user:
            session["user_id"] = user.id
            return redirect(url_for("paging.main", page="explore"))
    return render_template("auth.html", login_error="Invalid email or password.")
    

@auth_bp.route('/signup', methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        username = request.form.get("form-signup-username")
        email = request.form.get("form-signup-email")
        password = request.form.get("form-signup-password")
        
        user = create_account(username, email, password)

        if user is None:
            print("user email exist")
            return render_template(
                "auth.html",
                signup_error="Email already exist"
            )
    return redirect(url_for("auth.login"))

@auth_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))