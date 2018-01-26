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

# we want each token to be different as the same user can have more than one if they have multiple devices
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

        # phase 2. check that login is denied before token is activated
        rq = factory.get(reverse('auth'), data={'email': 'ee@ext.europarl.europa.eu', 'token': token_string})
        response = auth(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'TOKEN_NOT_ACTIVATED')

        internal_token.valid = True
        internal_token.save()

        # phase 3. login allowed
        rq = factory.get(reverse('auth'), data={'email': 'ee@ext.europarl.europa.eu', 'token': token_string})
        response = auth(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'OK')


class GetDistanceViewTest(TestCase):

    def test_get_distance_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import distance
        from models import Level, StairWell
        factory = RequestFactory()
        well = StairWell(building='ASP', shaft='South-East')
        well.save()

        l0 = Level(stairwell=well, floorNumber=0, steps=0)  # steps for this one should never matter.
        l0.save()
        l1 = Level(stairwell=well, floorNumber=1)
        l1.save()
        l2 = Level(stairwell=well, floorNumber=2)
        l2.save()
        l3 = Level(stairwell=well, floorNumber=3)
        l3.save()
        l8 = Level(stairwell=well, floorNumber=8)
        l8.save()

        rq = factory.get(reverse('distance'), data={'qr_id_1': l0.pk, 'qr_id_2': l3.pk})

        response = distance(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertIsNotNone(data['distance'])


class LogDistanceViewTest(TestCase):

    def test_log_distance_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import log_distance
        factory = RequestFactory()

        rq = factory.get(reverse('log_distance'), data={'token': '01234', 'distance': 25})

        response = log_distance(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertIsNotNone(data)
        # self.assertEqual(data['email'], 'ee@ext.europarl.europa.eu')


class ProfileViewTest(TestCase):

    def test_profile_view(self):
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import profile
        factory = RequestFactory()

        rq = factory.get(reverse('profile'), data={'email': 'ee@ext.europarl.europa.eu'})

        response = profile(rq)
        self.assertIsNotNone(response)
        data = json.loads(response.content)
        self.assertIsNotNone(data)
        # self.assertEqual(data['email'], 'ee@ext.europarl.europa.eu')


class UserStatsTest(TestCase):

    def test_add(self):
        from models import UserStats
        import datetime
        today = datetime.datetime(2017, 10, 20)

        monday = today - datetime.timedelta(days=today.weekday())
        tuesday = monday + datetime.timedelta(days=1)
        wednesday = monday + datetime.timedelta(days=2)
        thursday = monday + datetime.timedelta(days=3)
        friday = monday + datetime.timedelta(days=4)

        s = UserStats()
        self.assertEqual(s.monday_steps, 0)
        s.add(25, monday)
        self.assertEqual(s.monday_steps, 25)
        s.add(25, monday)
        self.assertEqual(s.monday_steps, 50)

        s.add(7, tuesday)
        self.assertEqual(s.tuesday_steps, 7)
        s.add(89, wednesday)
        self.assertEqual(s.wednesday_steps, 89)
        s.add(2, thursday)
        self.assertEqual(s.thursday_steps, 2)
        s.add(3, friday)
        self.assertEqual(s.friday_steps, 3)

    def test_total_steps(self):
        from models import UserStats
        import datetime
        today = datetime.datetime(2017, 10, 20)

        monday = today - datetime.timedelta(days=today.weekday())
        tuesday = monday + datetime.timedelta(days=1)
        wednesday = monday + datetime.timedelta(days=2)
        thursday = monday + datetime.timedelta(days=3)
        friday = monday + datetime.timedelta(days=4)
        saturday = monday + datetime.timedelta(days=5)
        sunday = monday + datetime.timedelta(days=6)

        s = UserStats()
        s.add(25, monday)
        s.add(25, monday)

        s.add(7, tuesday)
        s.add(89, wednesday)
        s.add(2, thursday)
        s.add(3, friday)
        s.add(5, saturday)
        s.add(9, sunday)

        self.assertEqual(s.total_steps(), 25+25+7+89+2+3+5+9)


class UserProfileViewTest(TestCase):
    def test_update_profile(self):
        from models import User, AuthToken
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import update_profile

        u = User()
        u.email = 'test@test.com'
        u.public_name = 'TEST'
        u.save()

        auth = AuthToken()
        auth.token_string = AuthToken.gen_token_string('test@test.com')
        auth.user = u
        auth.valid = True
        auth.save()

        factory = RequestFactory()

        rq = factory.get(reverse('update_profile'), data={'token': auth.token_string, 'nickname': 'El Nicknamo'})
        response = update_profile(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'OK')
        u = User.objects.get(pk=u.pk)
        self.assertEqual(u.public_name, 'El Nicknamo')


class UserLogDistanceViewTest(TestCase):
    def test_log_distance(self):
        from models import User, AuthToken, Level, StairWell
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import log_distance, distance, profile

        u = User()
        u.email = 'test@test.com'
        u.public_name = 'TEST'
        u.save()

        auth = AuthToken()
        auth.token_string = AuthToken.gen_token_string('test@test.com')
        auth.user = u
        auth.valid = True
        auth.save()

        sw = StairWell(building='ASP', shaft='south')
        sw.save()
        level1 = Level(stairwell=sw, floorNumber=1)
        level1.save()
        level2 = Level(stairwell=sw, floorNumber=2)
        level2.save()

        factory = RequestFactory()

        rq = factory.get(reverse('distance'), data={'qr_id_1': level1.pk, 'qr_id_2': level2.pk})

        response = distance(rq)

        data = json.loads(response.content)
        self.assertEqual(data['distance'], 18)

        rq = factory.get(reverse('log_distance'), data={'token': auth.token_string, 'steps': 18})
        response = log_distance(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'OK')

        rq = factory.get(reverse('profile'), data={'token': auth.token_string})
        response = profile(rq)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'OK')


class QRListTest(TestCase):
    def test_qr_list(self):
        from models import Level, StairWell
        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import qr_list

        sw = StairWell(building='ASP', shaft='south')
        sw.save()
        level1 = Level(stairwell=sw, floorNumber=1)
        level1.save()
        level2 = Level(stairwell=sw, floorNumber=2)
        level2.save()

        factory = RequestFactory()

        rq = factory.get(reverse('qr_list'))

        response = qr_list(rq)
        self.assertIsNotNone(response)


class AllTimeTop10Test(TestCase):
    def test_all_time(self):
        from models import UserStats, User
        import datetime

        from django.test import RequestFactory
        from django.core.urlresolvers import reverse
        from views import all_time_top_ten

        day = datetime.datetime(2017, 10, 20)

        for i in range(11):
            u = User(public_name='Roulio', email=str(i))
            u.save()
            s = UserStats(user=u, start_date=day)
            s.monday_steps = 10 + i
            s.save()
            s = UserStats(user=u, start_date=day - datetime.timedelta(days=7))
            s.monday_steps = 10 + i
            s.save()

        factory = RequestFactory()

        rq = factory.get(reverse('all_time_top_ten'))

        response = all_time_top_ten(rq)
        self.assertIsNotNone(response)


    def test_total_steps(self):
        from models import UserStats
        import datetime
        today = datetime.datetime(2017, 10, 20)

        monday = today - datetime.timedelta(days=today.weekday())
        tuesday = monday + datetime.timedelta(days=1)
        wednesday = monday + datetime.timedelta(days=2)
        thursday = monday + datetime.timedelta(days=3)
        friday = monday + datetime.timedelta(days=4)
        saturday = monday + datetime.timedelta(days=5)
        sunday = monday + datetime.timedelta(days=6)

        s = UserStats()
        s.add(25, monday)
        s.add(25, monday)

        s.add(7, tuesday)
        s.add(89, wednesday)
        s.add(2, thursday)
        s.add(3, friday)
        s.add(5, saturday)
        s.add(9, sunday)

        self.assertEqual(s.total_steps(), 25+25+7+89+2+3+5+9)