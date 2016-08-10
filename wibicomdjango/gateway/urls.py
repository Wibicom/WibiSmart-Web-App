from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^$', 'gateway.views.get_gateway_data')

]