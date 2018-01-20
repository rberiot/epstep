# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    public_name = models.TextField()

    def __str__(self):
        return str(self.email) + ' - ' + str(self.public_name)
