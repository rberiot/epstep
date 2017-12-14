# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from StairWell import StairWell


class Level(models.Model):
    stairwell = models.ForeignKey(StairWell, models.CASCADE)
    floorNumber = models.IntegerField()
    steps = models.PositiveIntegerField(default=18)
