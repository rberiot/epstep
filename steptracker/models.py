# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime
from epstep import settings


class StairWell(models.Model):
    building = models.TextField('building name ex: ASP, PHS, RMD')
    shaft = models.TextField('a name for the specific stairwell ex: North, South, Main')


class Level(models.Model):
    stairwell = models.ForeignKey(StairWell, models.CASCADE)
    floorNumber = models.IntegerField()
    steps = models.PositiveIntegerField(default=18)


class User(models.Model):
    email = models.EmailField()


class AuthToken(models.Model):
    token_string = models.TextField(unique=True)
    user = models.ForeignKey(User, models.CASCADE)
    date = models.DateField(default=datetime.date.today)
    valid = models.BooleanField(default=False)
    validation_key = models.TextField()


    @classmethod
    def gen_token_string(cls, email):
        import hashlib
        m = hashlib.md5()
        m.update(email)
        m.update("token_salt35457")
        m.update(str(datetime.datetime.now()))
        return m.hexdigest()

    def gen_validation_key(self):
        if self.valid:
            raise Exception('AuthToken is already valid')

        import hashlib
        m = hashlib.md5()
        m.update(self.token_string)
        m.update("token_salt74541")
        m.update(str(datetime.datetime.now()))
        self.validation_key = m.hexdigest()

    def validate(self, validation_key):
        if self.valid:
            raise Exception('AuthToken is already valid')

        if validation_key == self.validation_key:
            self.valid = True
            return True
        else:
            return False

    def send_validation_mail(self):
        from django.core.mail import send_mail

        if settings.EMAILS_ENABLED:
            send_mail(
                'EpStep Account Validation',
                'Here is the message. ' + self.validation_key,
                settings.EMAIL_HOST_USER,
                [self.user.email],
                fail_silently=False,
            )


class UserStats(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
