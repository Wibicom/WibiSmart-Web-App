from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^devicemanager/$', 'devicemanager.views.render_devicemanager_page', name='devicemanager'),
    url(r'^devicemanager/scan/$', 'devicemanager.views.scan', name='scan'),
    url(r'^devicemanager/deletedevice/$', 'devicemanager.views.deletedevice', name='deletedevice'),
    url(r'^devicemanager/adddevice/$', 'devicemanager.views.adddevice', name='adddevice'),
    url(r'^devicemanager/(?P<id>\d+)/$', 'devicemanager.views.devicesettings', name='devicesettings')

]