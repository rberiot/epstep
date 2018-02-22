
def is_email_valid(email):
    import django.core.validators
    from django.core.exceptions import ValidationError
    try:
        django.core.validators.validate_email(email)
        return True
    except ValidationError:
        return False


def is_spamming(email):
    import datetime
    from steptracker.models import User, AuthToken
    min_age = datetime.datetime.now() - datetime.timedelta(minutes=1)
    u = User.objects.get(email=email)
    recent_tokens = u.authtoken_set.filter(date__gt=min_age)

    return len(recent_tokens) > 0

