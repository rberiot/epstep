# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

import datetime

from django.utils import timezone
from django.test import TestCase

import models
from epstep import settings
import unittest
import json


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

#we want each token to be different as the same user can have more than one if they have multiple devices
        token = AuthToken.gen_token_string('remy@.com')
        same_token = AuthToken.gen_token_string('remy@.com')
        different_token = AuthToken.gen_token_string('autre@.com')

        self.assertIs(False, token == same_token)
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

    @unittest.skipUnless(settings.EMAILS_ENABLED, 'can''t work unless settings.EMAILS_ENABLED is True')
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

        auth.send_validation_mail(settings.PUBLIC_URL)
        self.assertEqual(len(mail.outbox), 1, msg='is settings.EMAILS_ENABLED set to True ?')


class AuthViewTest(TestCase):

    def test_auth_view_process(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import auth
        from models import AuthToken

        factory = RequestFactory()

        rq = factory.get(reverse('auth'), data={'email': 'ee@ext.europarl.europa.eu'})
        response = auth(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertIsNotNone(data['token'])
        self.assertIsNotNone(data['status'])
        self.assertEqual(data['status'], 'OK')
        token_string = data['token']

        internal_token = AuthToken.objects.get(token_string=token_string)
        self.assertIsNotNone(internal_token)


        #phase 2. check that login is denied before token is activated
        rq = factory.get(reverse('auth'), data={'email': 'ee@ext.europarl.europa.eu', 'token': token_string})
        response = auth(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'TOKEN_NOT_ACTIVATED')

        internal_token.valid = True
        internal_token.save()

        #phase 3. login allowed
        rq = factory.get(reverse('auth'), data={'email': 'ee@ext.europarl.europa.eu', 'token': token_string})
        response = auth(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'OK')


class GetDistanceViewTest(TestCase):

    def test_get_distance_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import distance
        factory = RequestFactory()

        rq = factory.get(reverse('distance'), data={'email': 'ee@ext.europarl.europa.eu'})

        response = distance(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertEqual(data['email'], 'ee@ext.europarl.europa.eu')


class LogDistanceViewTest(TestCase):

    def test_log_distance_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import log_distance
        factory = RequestFactory()

        rq = factory.get(reverse('log_distance'), data={'email': 'ee@ext.europarl.europa.eu'})

        response = log_distance(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertEqual(data['email'], 'ee@ext.europarl.europa.eu')


class ProfileViewTest(TestCase):

    def test_log_distance_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import profile
        factory = RequestFactory()

        rq = factory.get(reverse('profile'), data={'email': 'ee@ext.europarl.europa.eu'})

        response = profile(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertEqual(data['email'], 'ee@ext.europarl.europa.eu')