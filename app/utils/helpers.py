from datetime import datetime

def current_time():
    return datetime.utcnow()


def time_ago(date):
    now = current_time()
    diff = now - date

    seconds = int(diff.total_seconds())

    if seconds < 60:
        return "just now"

    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"

    hours = minutes // 60
    if hours < 24:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"

    days = hours // 24
    if days < 30:
        return f"{days} day{'s' if days != 1 else ''} ago"

    months = days // 30
    if months < 12:
        return f"{months} month{'s' if months != 1 else ''} ago"

    years = months // 12
    return f"{years} year{'s' if years != 1 else ''} ago"

CATEGORY_ICONS = {
    "Technology": "💻",
    "Healthcare": "🏥",
    "Business": "💼",
    "Games": "🎮",
    "Education": "📚",
    "Entertainment": "🎬",
    "Environment": "🌱",
    "Transportation": "🚗",
    "Food": "🍕",
    "Fashion": "👗",
    "Random": "🎲",
}

def get_category_icon(category):
    return CATEGORY_ICONS.get(category, "💡")

def get_initials(username):
    parts = username.split()

    if len(parts) > 1:
        return (parts[0][0] + parts[1][0]).upper()

    return parts[0][0].upper()