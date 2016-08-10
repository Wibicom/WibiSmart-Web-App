from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^devicemanager/$', 'devicemanager.views.render_devicemanager_page', name='devicemanager')

]