
def is_email_valid(email):
    import django.core.validators
    from django.core.exceptions import ValidationError
    try:
        django.core.validators.validate_email(email)
        return True
    except ValidationError:
        return False
