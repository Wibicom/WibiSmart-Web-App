from django.contrib import admin

#This is where you list all the schemas that were used in models.py
from .models import User

admin.site.register(User)




