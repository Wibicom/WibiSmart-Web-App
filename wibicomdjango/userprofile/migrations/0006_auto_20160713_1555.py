# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-13 19:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0005_auto_20160713_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='device',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='userprofile.Device'),
        ),
    ]
