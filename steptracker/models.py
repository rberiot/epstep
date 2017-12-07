# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime


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
    token = models.TextField()
    user = models.ForeignKey(User, models.CASCADE)
    date = models.DateField(default=datetime.date.today)


class UserStats(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
