# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
import models


class LevelInline(admin.TabularInline):
    model = models.Level
    can_delete = True
    ordering = ['floorNumber']

@admin.register(models.StairWell)
class StairwellAdmin(admin.ModelAdmin):
    inlines = [
        LevelInline,
    ]

#admin.site.register(models.StairWell)