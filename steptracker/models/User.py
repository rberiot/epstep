# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    public_name = models.TextField()

    def reset_public_name(self):
        try:
            email_name, _ = self.email.split('@', 1)
            first_name, last_name = email_name.split('.', 1)
            self.public_name = first_name.capitalize() + ' ' + last_name[:1].upper() + '.'
        except:
            self.first_name = 'Jane Doe'

    def __str__(self):
        return str(self.email) + ' - ' + str(self.public_name)
