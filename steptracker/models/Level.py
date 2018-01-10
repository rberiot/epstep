# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from StairWell import StairWell


class Level(models.Model):
    stairwell = models.ForeignKey(StairWell, models.CASCADE)
    floorNumber = models.IntegerField()
    steps = models.PositiveIntegerField(default=18)

    @classmethod
    def distance(cls, start, end):
        if start.stairwell != end.stairwell or start.floorNumber == end.floorNumber:
            raise Exception("QR are not in the same stairwell")

        lower_floor = start if start.floorNumber < end.floorNumber else end
        upper_floor = end if end.floorNumber > start.floorNumber else start

        #we need to find all the floors inbetween
        inbetween_levels = cls.objects.filter(floorNumber__gt=lower_floor.floorNumber,
                           floorNumber__lt=upper_floor.floorNumber,
                           stairwell=start.stairwell)

        levels_climbed = [upper_floor]  #lower floor is not included as its step count relates to climbing up to it
        levels_climbed.extend(inbetween_levels)

        print(levels_climbed)

        return sum([x.steps for x in levels_climbed])

    def __str__(self):
        return 'level ' + str(self.floorNumber)
