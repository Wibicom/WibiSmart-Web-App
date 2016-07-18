from __future__ import unicode_literals

from django.db import models

# Create your models here.
class User(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    # this method is used to differentiate objects when you look at the database
    # shows the firstName and lastName instead of ObjectUser
    def __str__(self):
        return self.firstName + " " + self.lastName

    #this method creates a url to view this particular object when you click on viewOnSite on admin section website
    def get_absolute_url(self):
        return '/home/%s/' % self.id

