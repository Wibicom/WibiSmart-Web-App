# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-21 14:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='User',
        ),
    ]
