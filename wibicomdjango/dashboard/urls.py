from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^(?P<id>\d+)/$', 'dashboard.views.onedevice_dashboard'),
    url(r'^(?P<id>\d+)/historicalDashboard/$', 'dashboard.views.onedevice_dashboard_historical'),
    url(r'^(?P<id>\d+)/renderdata/$', 'dashboard.views.onedevice_dashboard_ajax'),

    url(r'^(?P<id>\d+)/csvoutput_meteo/$', 'dashboard.views.csv_output_meteo'),
    url(r'^(?P<id>\d+)/csvoutput_energy/$', 'dashboard.views.csv_output_energy'),
    url(r'^(?P<id>\d+)/csvoutput_accelerometer/$', 'dashboard.views.csv_output_accelerometer'),
    url(r'^(?P<id>\d+)/csvoutput_pressure/$', 'dashboard.views.csv_output_pressure'),

]

