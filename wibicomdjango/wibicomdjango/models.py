from __future__ import unicode_literals
from django.db import models


class ReceivedAndroidData(models.Model):
    lineOfChar = models.CharField(max_length=50, null=True)

