# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime
from steptracker.models import User


class UserStats(models.Model):
    """
    represents a user's daily stats. this record's data will be incremented during the day
    """
    user = models.ForeignKey(User, models.CASCADE)