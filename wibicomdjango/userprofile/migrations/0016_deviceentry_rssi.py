# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-23 19:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0015_auto_20160822_1534'),
    ]

    operations = [
        migrations.AddField(
            model_name='deviceentry',
            name='rssi',
            field=models.IntegerField(null=True),
        ),
    ]
