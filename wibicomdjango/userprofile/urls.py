from django.conf.urls import patterns, include, url

urlpatterns = [
    url(r'^profile/$', 'userprofile.views.user_profile', name='profile'),
    url(r'^deletedevice/$', 'userprofile.views.delete_device', name='delete_device'),


    url(r'^profile/changepassword/$', 'userprofile.views.password_change', name='password_change'),
    url(r'^profile/deleteaccount$', 'userprofile.views.delete_account', name='delete_account'),
    url(r'^profile/editdevice/$', 'userprofile.views.edit_device', name='edit_device'),

    url(r'^profile/adddevice/$', 'userprofile.views.add_device', name='add_device')



]