from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User



class UserProfile(models.Model):
    user = models.OneToOneField(User)
    profession= models.CharField(max_length=50, null=True)
    #device = models.ForeignKey(Device, null=True) # null = true is to allow null values for devices

User.profile = property(lambda u : UserProfile.objects.get_or_create(user=u)[0])


class Device(models.Model):
    user = models.ForeignKey(User, null=True) #made a change here from UserProfile to User
    deviceNb = models.CharField(max_length=50, null=True)
    deviceType = models.CharField(max_length=50, null=True)
    deviceName = models.CharField(max_length= 100, null = True)

    def __str__(self):
        return self.deviceName

    def __unicode__(self):
        return str(self.deviceName)


class DeviceEntry(models.Model):
    device = models.ForeignKey(Device, null=True)
    datetime = models.CharField(max_length=50, null=True)
    pressure = models.FloatField(null=True)
    humidity = models.FloatField(null=True)
    temperature = models.FloatField(null=True)
    battery = models.IntegerField(null=True)
    light = models.IntegerField(null=True)
    accx = models.FloatField(null=True)
    accy = models.FloatField(null=True)
    accz = models.FloatField(null=True)

    def __unicode__(self):
        return str(self.datetime) + " " + str(self.pressure) + " " + str(self.humidity)
