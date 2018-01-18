# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import datetime
from steptracker.models import User
from steptracker.utils.converter import to_calories, to_meters


class UserStats(models.Model):
    """
    represents a user's stats for a whole week. this record's data will be incremented during the day
    """
    user = models.ForeignKey(User, models.CASCADE, unique_for_date='day')
    # the week's monday
    start_date = models.DateField(default=datetime.date.today)
    monday_steps = models.IntegerField(default=0)
    tuesday_steps = models.IntegerField(default=0)
    wednesday_steps = models.IntegerField(default=0)
    thursday_steps = models.IntegerField(default=0)
    friday_steps = models.IntegerField(default=0)
    saturday_steps = models.IntegerField(default=0)
    sunday_steps = models.IntegerField(default=0)

    @classmethod
    def record_stats(cls, user, steps, day=None):
        if not day:
            day = datetime.date.today()

        monday = day - datetime.timedelta(days=day.weekday())
        friday = monday + datetime.timedelta(days=4)

        stats = cls.objects.filter(user=user, start_date=monday)

        week_stats = None
        if len(stats) < 1:
            week_stats = UserStats(user=user, start_date=monday)
        else:
            week_stats = stats[0]

        week_stats.add(steps, day)
        week_stats.save()

    @classmethod
    def get_weekly_stats(cls, user, week=None):
        # first lets get the range of date which starts on monday.
        if not week:
            week = datetime.date.today()

        if week.weekday() != 0:
            week = week - datetime.timedelta(days=week.weekday())

        monday = week
        friday = monday + datetime.timedelta(days=4)

        res = UserStats.objects.filter(user=user).filter(start_date=week)

        stats = res[0] if len(res) != 0 else UserStats(user=user, start_date=week)

        return {'total_steps': stats.total_steps(),
                'total_meters': to_meters(stats.total_steps()),
                'total_cal': to_calories(stats.total_steps()),
                'monday': stats.monday_steps,
                'tuesday': stats.tuesday_steps,
                'wednesday': stats.wednesday_steps,
                'thursday': stats.thursday_steps,
                'friday': stats.friday_steps,
                'saturday': stats.saturday_steps,
                'sunday': stats.sunday_steps,
                }

    @classmethod
    def get_weekly_top_10(cls, week=None):
        # first lets get the range of date which starts on monday.
        if not week:
            week = datetime.date.today()

        if week.weekday() != 0:
            week = week - datetime.timedelta(days=week.weekday())

        all_stats = UserStats.objects.filter(start_date=week)
        sorted_stats = sorted(all_stats, key=lambda s: s.total_steps(), reverse=True)

        return sorted_stats[:10]

    @classmethod
    def get_all_time_stats(cls, user):
        all_stats = cls.objects.filter(user=user)
        total_steps = sum(map((lambda x: x.total_steps()), all_stats))
        return {'all_time_cal': to_calories(total_steps),
                'all_time_steps': total_steps,
                'all_time_meters': to_meters(total_steps)
                }

    def add(self, steps, day=datetime.date.today()):
        if day.weekday() == 0:
            self.monday_steps += steps
        if day.weekday() == 1:
            self.tuesday_steps += steps
        if day.weekday() == 2:
            self.wednesday_steps += steps
        if day.weekday() == 3:
            self.thursday_steps += steps
        if day.weekday() == 4:
            self.friday_steps += steps
        if day.weekday() == 5:
            self.saturday_steps += steps
        if day.weekday() == 6:
            self.sunday_steps += steps

    def total_steps(self):
        total = 0

        total += self.monday_steps
        total += self.tuesday_steps
        total += self.wednesday_steps
        total += self.thursday_steps
        total += self.friday_steps
        total += self.saturday_steps
        total += self.sunday_steps

        return total
