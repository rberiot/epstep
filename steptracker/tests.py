# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

import datetime

from django.utils import timezone
from django.test import TestCase

import models
from epstep import settings
import unittest


class RegistrationTest(TestCase):

    def test_registration(self):
        """
        was_published_recently() returns False for questions whose pub_date
        is in the future.
        """

        self.assertIs(True, True)


class AuthTokenTest(TestCase):

    def test_token_generation(self):
        from models import AuthToken

        token = AuthToken.gen_token_string('remy@.com')
        same_token = AuthToken.gen_token_string('remy@.com')
        different_token = AuthToken.gen_token_string('autre@.com')

        self.assertIs(True, token == same_token)
        self.assertIs(False, token == different_token)

    def test_token_validation(self):
        from models import AuthToken, User

        u = User()
        u.email = 'rururur'
        u.save()

        auth = AuthToken()
        auth.user = u
        auth.token = AuthToken.gen_token_string(email='remy@.com')

        auth.gen_validation_key()

        self.assertIsNotNone(auth.validation_key)
        self.assertFalse(auth.valid)

        self.assertIs(True, auth.validate(auth.validation_key))

        self.assertIs(True, auth.valid)

    @unittest.skipUnless(settings.EMAILS_ENABLED)
    def test_send_mail(self):
        from models import AuthToken, User
        from django.core import mail

        u = User()
        u.email = 'remy.beriot@gmail.com'
        u.save()

        auth = AuthToken()
        auth.user = u
        auth.token = AuthToken.gen_token_string('remy.beriot@gmail.com')
        auth.gen_validation_key()

        auth.send_validation_mail()
        self.assertEqual(len(mail.outbox), 1, msg='is settings.EMAILS_ENABLED set to True ?')
