def valid_email(email):

    return "@" in email


def valid_password(password):

    return len(password) >= 8