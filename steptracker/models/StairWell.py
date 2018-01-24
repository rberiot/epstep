# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class StairWell(models.Model):
    building = models.TextField('building name ex: ASP, PHS, RMD')
    shaft = models.TextField('a name for the specific stairwell ex: North, South, Main')

    def __str__(self):
        return self.building + '-' + self.shaft
