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
    email = models.EmailField(unique=True)
    public_name = models.TextField()

    def __str__(self):
        return str(self.email) + 'valid: ' + str(self.public_name)


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

    def send_validation_mail(self, public_url):
        from django.core.mail import send_mail

        #todo prevent spamming with a timmer
        if settings.EMAILS_ENABLED:
            send_mail(
                'EpStep Account Validation',
                'Here is the message. ' + public_url + 'validate_token/?validation_key=' +
                self.validation_key + '&email=' + self.user.email,
                settings.EMAIL_HOST_USER,
                [self.user.email],
                fail_silently=False,
            )

    @classmethod
    def is_token_valid(cls, email, token_string):
        token_list = cls.objects.filter(token_string=token_string)
        if token_list:
            return token_list[0].valid
        else:
            return False

    def __str__(self):
        return str(self.user.email) + 'valid: ' + str(self.valid) + ' token: ' + str(self.token_string)


class UserStats(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
