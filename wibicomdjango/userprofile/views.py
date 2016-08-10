from django.shortcuts import render
from django.shortcuts import render_to_response
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.core.context_processors import csrf
from forms import UserProfileForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm

from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import get_object_or_404

from django.template.response import TemplateResponse

from forms import UserProfileForm
from forms import DeviceForm
from forms import DeleteDeviceForm
from forms import EditProfileForm
from forms import EditDeviceForm

import csv
import datetime
from random import randint
import json, ast
from datetime import datetime as dt

from models import Device
from models import DeviceEntry

import requests

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
def user_profile_old_function(request): #this is a function that was done first, i keep for records but will have to delete
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        #we want to populate the form with the original instance of the profile model and insert POST info on top of it
        device_form = DeviceForm(request.POST)
        form = UserProfileForm(request.POST, instance=profile)
        edit_profile_form = EditProfileForm(request.POST, instance=user)
        print "i am here"
        if device_form.is_valid() and form.is_valid and edit_profile_form.is_valid():
            dev = device_form.save(commit=False)
            newdevice = Device()
            newdevice.deviceNb = dev.deviceNb
            newdevice.deviceType = dev.deviceType
            newdevice.user_id = profile.pk
            newdevice.save()
            form.save()

            usermod = edit_profile_form.save(commit = False)
            user.email = usermod.email
            user.first_name= usermod.first_name
            print "***********************"
            print usermod.first_name
            print "***********************"
            user.last_name = usermod.last_name
            user.save()


            #generating entries in device
            #generate_device_journal(request, newdevice)

            return redirect('loggedin')

        else:

            return redirect('profile')

    else: # when this is a get request
        #if we have a user that has already selected info, it will pass in this info
        form = UserProfileForm(instance=profile)
        device_form = DeviceForm()
        edit_profile_form = EditProfileForm(instance = user)

    userid = request.user.profile.pk
    data = Device.objects.filter(user_id=userid)

    args = {}
    args['form'] = form
    args['device_form'] = device_form
    args['edit_profile_form'] = edit_profile_form
    args['listOfDevices']= data
    args ['full_name'] = request.user.username

    return render(request, 'profile.html', args)


@login_required
def user_profile(request):
    user = request.user
    profile = user.profile
    listOfDevices = Device.objects.filter(user_id=user.pk)

    if request.method == 'POST':
        edit_device_form = EditDeviceForm(request.POST, user=request.user.pk) #added
        edit_profile_form = EditProfileForm(request.POST, instance=user)
        if edit_profile_form.is_valid():
            edit_profile_form.save()

        if edit_device_form.is_valid(): #the following lines are added
            devicetoedit = Device.objects.get(id=request.POST.get('devices'))
            devicetoedit.deviceName = request.POST.get('new_device_name')
            devicetoedit.save()
            return redirect('profile')

    else: # when this is a get request
        form = UserProfileForm(instance=profile)
        device_form = DeviceForm()
        edit_profile_form = EditProfileForm(instance = user)
        edit_device_form = EditDeviceForm(user=request.user.pk) #added
        edit_device_form.fields['devices'].choices = [(x.id, x) for x in Device.objects.filter(user=request.user.pk)] #added

    args = {}
    args['edit_profile_form'] = edit_profile_form
    args['edit_device_form'] = edit_device_form
    args['listOfDevices']= listOfDevices
    args ['full_name'] = request.user.username

    return render(request, 'profile.html', args)

@login_required()
def delete_device(request):
    if request.method == 'POST':
        deletedeviceform = DeleteDeviceForm(request.POST, user=request.user.pk)
        if deletedeviceform.is_valid():
            devicelist = request.POST.getlist('devices')
            firstitem = devicelist[0]
            for i in range(0, len(devicelist)): # i have to loop that way since I want integers, not unicode
                Device.objects.get(id=devicelist[i]).delete() #the unicode of devicelist, returns the deviceNb for each device

            return redirect('loggedin')


    else: #if not a POST request (first time user gets there)
        userid = request.user.pk
        devices = Device.objects.filter(user_id=userid)
        deletedeviceform = DeleteDeviceForm()
        deletedeviceform.fields['devices'].choices = [(x.id, x) for x in devices]

    return render(request, 'userprofile/delete_device.html', {"full_name": request.user.username, "deletedeviceform": deletedeviceform,})

@login_required()
def edit_device(request):
    if request.method == 'POST':
        edit_device_form = EditDeviceForm(request.POST, user = request.user.pk)
        if edit_device_form.is_valid():
                devicetoedit= Device.objects.get(id = request.POST.get('devices'))
                devicetoedit.deviceName = request.POST.get('new_device_name')
                devicetoedit.save()
                return redirect('profile')
    else:
        edit_device_form = EditDeviceForm(user=request.user.pk)
        edit_device_form.fields['devices'].choices = [(x.id, str(x)) for x in Device.objects.filter(user= request.user.pk)]

    return render(request, 'userprofile/edit_device.html', {"edit_device_form": edit_device_form,})



@login_required()
def password_change(request):
    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect("profile")
    else:
        form = PasswordChangeForm(user=request.user)

    return render(request, "userprofile/change_password.html", {"form": form})


@login_required()
def delete_account(request):
    if request.method == 'POST':

        usertodelete= User.objects.get(pk=request.user.pk)

        usertodelete.delete()

    return redirect('home')




@login_required()
def add_device(request):
    print "im in "
    r = requests.get("http://raspberrypi:8000/gap/nodes")

    r = json.loads(r.content)

    print r.values()[0]
    mylist = (r.values()[0])

    list_names = []
    list_adresses = []

    for i in range(len(mylist)):
        print mylist[i]
        print type(mylist[i])
        print mylist[i]['name']
        list_names.append(mylist[i]['name'].encode("utf-8"))

        print mylist[i]['address']
        list_adresses.append(mylist[i]['address'].encode("utf-8"))

        devices_found = zip(list_names, list_adresses)

    return HttpResponse(devices_found)