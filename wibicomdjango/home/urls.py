#url files are responsible for routing traffic in django
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<user_id>\d+)/$', views.index, name='index'),
    url(r'^$', views.showHome, name='home'),
]
