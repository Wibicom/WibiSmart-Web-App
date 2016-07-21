from django.shortcuts import render_to_response
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.core.context_processors import csrf
from forms import MyRegistrationForm
from userprofile.models import Device
from userprofile.models import DeviceEntry
from userprofile.models import UserProfile
from django.shortcuts import get_object_or_404

from models import ReceivedAndroidData

from rest_framework.authtoken.models import Token
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


import json

from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required

def login(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('login.html', c)

def auth_view(request):
    #looks at request from login view , if you cant find value return ""
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)

    if user is not None:
        auth.login(request,user)
        return HttpResponseRedirect('/accounts/loggedin')
    else:
        return HttpResponseRedirect('/accounts/invalid')

@login_required()
def loggedin(request):
    userid = request.user.pk
    data = Device.objects.filter(user_id=userid)

    return render_to_response('loggedin.html', {'full_name': request.user.username, 'user_profile_id': userid,
                                                'listOfDevices': data})

def invalid_login(request):
    return render_to_response('invalid_login.html')

def logout(request):
    auth.logout(request)
    return render(request, "home/home.html")

def register_user(request):
    #the first time it would turn false, because no data from the form to the url
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/accounts/register_success')

    #what happens the first time
    args = {}
    args.update(csrf(request))
    args['form'] = MyRegistrationForm() #no POST in its argument

    return render_to_response('register.html', args)

# because we want every user to have an automatically generated Token
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

def register_success(request):
    return render_to_response('register_success.html')


@csrf_exempt
def receive_android_data(request):

    if request.method == 'POST':
        json_data = json.loads(request.body)
        token = json_data['token']

        #verifying that the token exists in the db and if not, quit the function
        try:
            Token.objects.get(key=token)
        except Token.DoesNotExist:
            print "***********No valid tokenobj********"
            return render(request, "userprofile/receive_android_data.html")

        tokenobj= Token.objects.get(key=token)
        userid = tokenobj.user_id   #finding the user that is sending the request
        deviceNb = json_data["deviceNb"]
        deviceType = json_data["deviceType"]

        Device.objects.get_or_create(deviceNb=deviceNb, deviceType=deviceType)
        device = Device.objects.get(deviceNb = deviceNb, deviceType =  deviceType)
        #check the user of the device to see if the device belongs to the user
        print device
        try:
            print device.user_id
            if device.user_id is None:
                # le device vient detre creer
                print "***************Im in user_id is None***************"
                print userid
                device.user_id = userid #user id , and not profile id
                device.save()

            elif device.user_id == userid :
                # le device appartient bel et bien au user
                pass
            else:
                #le device est creer mais nappartient pas au user
                raise ValueError("The device exists but doesnt belong the the user sending the token")
        except ValueError as err:
            print(err)
            return render(request, "userprofile/receive_android_data.html")

        deviceentry = DeviceEntry()
        deviceentry.device = device  # put the primary key of the device here
        deviceentry.datetime = json_data["datetime"]
        deviceentry.pressure = json_data["pressure"]
        deviceentry.humidity = json_data["humidity"]
        deviceentry.temperature = json_data["temperature"]
        deviceentry.battery = json_data["battery"]
        deviceentry.light = json_data["light"]
        deviceentry.accx = json_data["accx"]
        deviceentry.accy = json_data["accy"]
        deviceentry.accz = json_data["accz"]
        deviceentry.save()

    return render(request, "userprofile/receive_android_data.html")

