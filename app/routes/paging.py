from flask import Blueprint, render_template, jsonify

paging_bp = Blueprint("paging", __name__)

@paging_bp.route("/")
def home():
    return render_template("index.html")

@paging_bp.route("/main/<page>")
def main(page):
    return render_template("main.html", page=page)

@paging_bp.route("/explore")
def explore():
    return render_template("explore.html")

@paging_bp.route("/profile")
def profile():
    return render_template("profile.html")

@paging_bp.route("/nav")
def nav():
    return render_template("/components/navbar.html")

@paging_bp.route("/footer")
def footer():
    return render_template("footer.html")
