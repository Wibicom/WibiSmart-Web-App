from django.shortcuts import render
from django.http import HttpResponse

from django.contrib.auth.decorators import login_required
#from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User

from django.template.response import TemplateResponse

import csv
import datetime

import json
from datetime import datetime as dt
from userprofile.models import Device
from userprofile.models import DeviceEntry

# Create your views here.
@login_required()
def onedevice_dashboard(request, id):
    #this generates the dashboard
    print "im in here"

    full_name = request.user.username
    device = Device.objects.get(id = id)
    device_entries = DeviceEntry.objects.filter(device_id = device).order_by('datetime')
    #find the last 10 entries
    last_ten_entries = device_entries.reverse()[:10] #i would have liked a function such as latest() that returns last 10 objects but doesn't seem to exist
    #loop over ten entries, a chaque temperature last_ten_entries[i].temperature je append ca dans une liste [3,4,2]
    last_thirty_entries = device_entries.reverse()[:30]

    temperaturelist = []
    accxlist = []
    accylist = []
    acczlist = []

    print last_ten_entries
    for entry in last_ten_entries:
        temperaturelist.append(entry.temperature)

    for entry in last_thirty_entries:
        #this list starts with the latest data and ends with oldest data, we want contrary
        accxlist.append(entry.accx)
        accylist.append(entry.accy)
        acczlist.append(entry.accz)



    temperaturelist= temperaturelist[::-1] #reverse the list so that starts with oldest data
    accxlist = accxlist[::-1]
    accylist = accylist[::-1]
    acczlist = acczlist[::-1]

    print (len(device_entries)-1)
    last_entry = device_entries.latest('datetime')
    print " #&@&@&@&@&@&"
    print last_entry

    live_battery = last_entry.battery

    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    return TemplateResponse(request, 'dashboard/oneDevice_dashboard.html', {"full_name": full_name,
                                                                              "deviceNb": device.deviceNb,
                                                                              "deviceName" : device.deviceName,
                                                                              "deviceType" : device.deviceType,
                                                                              "deviceId": device.pk,
                                                                              "device_entries": device_entries,
                                                                              "listOfDevices": listOfDevices,
                                                                              "live_battery" : live_battery,
                                                                              "temperaturelist": temperaturelist,
                                                                              "accxlist": accxlist,
                                                                              "accylist": accylist,
                                                                              "acczlist": acczlist,
                                                                              })
@login_required()
def onedevice_dashboard_ajax(request, id):
    print "im in ajax"
    #rendering data ajax call
    device = Device.objects.get(id = id)
    device_entries = DeviceEntry.objects.filter(device_id=device)

    #last_entry = device_entries[len(device_entries) - 1]
    last_entry = device_entries.latest('datetime')
    live_battery = last_entry.battery
    live_humidity = last_entry.humidity
    live_pressure = last_entry.pressure
    live_temperature = last_entry.temperature
    live_accx = last_entry.accx
    live_accy = last_entry.accy
    live_accz = last_entry.accz
    #print last_entry.datetime
    #print "***********************************"
    #print live_accx
    #print live_accy
    #print live_accz

    response_data = {}
    try:
        response_data['result'] = "Success"
        response_data['message'] = "great!"
        response_data['live_battery'] = live_battery
        response_data['live_humidity'] = live_humidity
        response_data['live_pressure'] = live_pressure
        response_data['live_temperature'] = live_temperature
        response_data['live_accx']= live_accx
        response_data['live_accy']= live_accy
        response_data['live_accz']= live_accz
    except:
        response_data['result'] = "Failure"
        response_data['message'] = "it did not work"

    return HttpResponse(json.dumps(response_data), content_type ="application/json")

@login_required()
def csv_output(request, id): # this is the device id that is passed here
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'

    device = Device.objects.get(id=id) # get the device that is passed in
    device_entries = DeviceEntry.objects.filter(device_id=device)[:15] # get the entries of this device

    datetimes = device_entries.values('datetime')


    battery_values = device_entries.values('battery')
    #print len(battery_values)
    #print battery_values

    writer = csv.writer(response)


    writer.writerow(['Date', 'Battery level'])
    for i in range(0, len(datetimes)): #datetimes and battery_values have the same size
        row = []
        #getting the dates
        date= json.dumps(datetimes[i])
        date = json.loads(date)
        date = date['datetime']
        date = date.encode("utf-8")
        old_format = '%b %d, %Y %H:%M:%S %p'
        #2009/07/12 12:34:56
        #new_format = '%Y%m%d'
        new_format = '%Y/%m/%d %H:%M:%S'
        date = dt.strptime(date, old_format).strftime(new_format)
        row.append(date)

        #getting the batteries
        batt = json.dumps(battery_values[i])
        batt= json.loads(batt)
        batt = batt['battery']
        row.append(batt)

        writer.writerow(row)



    return response
