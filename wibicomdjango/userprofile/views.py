from django.shortcuts import render
from django.shortcuts import render_to_response
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from forms import UserProfileForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import get_object_or_404
from home.models import User
from django.template.response import TemplateResponse

from forms import UserProfileForm
from forms import DeviceForm
from forms import DeleteDeviceForm

import datetime
from random import randint
import json

from models import Device
from models import DeviceEntry


#this verifies that user is logged in and redirects user to login page if not logged in
@login_required
def edit_profile(request):
    return render_to_response('userprofile/edit_profile.html', {'full_name' : request.user.username})

def battery_reader():
    return randint(0,100)

def light_reader():
    return randint(0,1000)

def temperature_reader():
    return randint(0,30)

def humidity_reader():
    return randint(0,100)

def pressure_reader():
    return randint(100,105)

@login_required()
def generate_device_journal(request,newdevice):
    for x in range(0, 10):
        entry = DeviceEntry()
        entry.humidity = humidity_reader()
        entry.pressure = pressure_reader()
        entry.device = newdevice
        entry.datetime = datetime.datetime.now()
        entry.temperature = 30
        entry.batter = 20
        entry.light = 1000
        entry.accx = 2
        entry.accy = 1
        entry.accz = 1
        entry.save()

@login_required
def user_profile(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        #we want to populate the form with the original instance of the profile model and insert POST info on top of it
        device_form = DeviceForm(request.POST)
        form = UserProfileForm(request.POST, instance=profile)

        if device_form.is_valid() and form.is_valid:
            dev = device_form.save(commit=False)
            newdevice = Device()
            newdevice.deviceNb = dev.deviceNb
            newdevice.deviceType = dev.deviceType
            newdevice.user_id = profile.pk
            newdevice.save()
            form.save()

            #generating entries in device
            #generate_device_journal(request, newdevice)

            return redirect('loggedin')

        else:

            return redirect('profile')

    else: # when this is a get request
        #if we have a user that has already selected info, it will pass in this info
        form = UserProfileForm(instance=profile)
        device_form = DeviceForm()

    args = {}
    args['form'] = form
    args['device_form'] = device_form
    return render(request, 'profile.html', args)



@login_required()
def delete_device(request):
    if request.method == 'POST':
        deletedeviceform = DeleteDeviceForm(request.POST, user=request.user.profile.pk)
        if deletedeviceform.is_valid():
            devicelist = request.POST.getlist('devices')
            firstitem = devicelist[0]
            for i in range(0, len(devicelist)): # i have to loop that way since I want integers, not unicode
                Device.objects.get(id=devicelist[i]).delete() #the unicode of devicelist, returns the deviceNb for each device

            return redirect('loggedin')


    else: #if not a POST request (first time user gets there)
        userid = request.user.profile.pk
        devices = Device.objects.filter(user_id=userid)
        deletedeviceform = DeleteDeviceForm()
        deletedeviceform.fields['devices'].choices = [(x.id, x) for x in devices]

    return render(request, 'userprofile/delete_device.html', {"full_name": request.user.username, "deletedeviceform": deletedeviceform,})



@login_required()
def onedevice_dashboard(request,id):
    #this generates the dashboard

    full_name = request.user.username
    device = Device.objects.get(id = id)
    device_name = device.deviceNb
    device_entries = DeviceEntry.objects.filter(device_id = device)

    userid = request.user.profile.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    return TemplateResponse(request, 'userprofile/oneDevice_dashboard.html', {"full_name": full_name,
                                                                              "device_name": device_name,
                                                                              "device_entries": device_entries,
                                                                              "listOfDevices": listOfDevices,
                                                                              })




