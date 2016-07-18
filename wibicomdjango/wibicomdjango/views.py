from django.shortcuts import render_to_response
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.core.context_processors import csrf
from forms import MyRegistrationForm
from userprofile.models import Device
from userprofile.models import DeviceEntry
from models import ReceivedAndroidData

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
    userid = request.user.profile.pk
    data = Device.objects.filter(user_id=userid)

    return render_to_response('loggedin.html', {'full_name': request.user.username, 'user_profile_id': userid,
                                                'listOfDevices': data})

def invalid_login(request):
    return render_to_response('invalid_login.html')

def logout(request):
    auth.logout(request)
    return render_to_response('logout.html')

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

def register_success(request):
    return render_to_response('register_success.html')



def receive_android_data(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)  # request.raw_post_data w/ Django < 1.4
        deviceentry = DeviceEntry()

        deviceNb = json_data[
            "deviceNb"]  # i am receiving a device number and need to find the primary key for that number
        devicepk = Device.objects.get(deviceNb=deviceNb)

        deviceentry.device = devicepk  # put the primary key of the device here
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

