from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^(?P<id>\d+)/$', 'dashboard.views.onedevice_dashboard'),
    url(r'^(?P<id>\d+)/renderdata/$', 'dashboard.views.onedevice_dashboard_ajax'),
    url(r'^(?P<id>\d+)/csvoutput/$', 'dashboard.views.csv_output'),

]