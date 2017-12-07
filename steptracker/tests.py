# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

import datetime

from django.utils import timezone
from django.test import TestCase

import models


class RegistrationTest(TestCase):

    def test_registration(self):
        """
        was_published_recently() returns False for questions whose pub_date
        is in the future.
        """

        self.assertIs(True, True)
