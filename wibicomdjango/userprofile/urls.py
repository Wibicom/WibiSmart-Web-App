from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^profile/$', 'userprofile.views.user_profile', name='profile'),
    url(r'^deletedevice/$', 'userprofile.views.delete_device', name='delete_device'),
    #url(r'^(?P<device_id>\d+)/$', 'userprofile.views.onedevicedashboard', name='onedevicedashboard'),
    url(r'^loggedin/(?P<id>\d+)/$', 'userprofile.views.onedevice_dashboard'),


]