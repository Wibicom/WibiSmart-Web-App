"""wibicomdjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import include, url
from django.contrib import admin
from rest_framework.authtoken import views



from registration.backends.simple.views import RegistrationView



urlpatterns = [
    url(r'^gateway/', include('gateway.urls')),
    url(r'^accounts/', include('userprofile.urls')),

    #these are the logins that have to do with loggging in and logging out
    url(r'^accounts/login/$', 'wibicomdjango.views.login', name='login'),
    url(r'^accounts/auth/$', 'wibicomdjango.views.auth_view'),
    url(r'^accounts/logout/$', 'wibicomdjango.views.logout', name = 'logout'),
    url(r'^accounts/loggedin/$', 'wibicomdjango.views.loggedin', name = 'loggedin'),


    url(r'^accounts/loggedin/', include('dashboard.urls')),
    url(r'^accounts/loggedin/', include('devicemanager.urls'), name= 'devicemanager'),


    url(r'^accounts/invalid/$', 'wibicomdjango.views.invalid_login'),

    #these are used for the registration
    url(r'^accounts/register/$', 'wibicomdjango.views.register_user', name='register'),
    url(r'^accounts/register_success/$', 'wibicomdjango.views.register_success'),


    #url(r'^accounts/', include('registration.backends.simple.urls')),
    url(r'^home/', include('home.urls'), name='home'),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^receiveandroiddata/$', 'wibicomdjango.views.receive_android_data'),

    url(r'^api-token-auth/', views.obtain_auth_token),


]
