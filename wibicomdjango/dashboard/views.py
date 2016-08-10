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
from datetime import timedelta
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


def switcher(period):
    now = datetime.datetime.now()

    return {
        'day': datetime.datetime(now.year, now.month, now.day, 0, 0, 0, 0),
        'week': now - timedelta(days=7),
        'month': now - timedelta(days=31),
        'year': now - timedelta(days=365),
        'max': "max",
    }.get(period, "default_return")

@login_required()
def csv_output_energy(request, id):
    if (request.method == 'GET'):
        print request.GET['selected_period']
        start_date = switcher(request.GET['selected_period'])

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        device = Device.objects.get(id=id)

        if (start_date == "max"):
            device_entries = DeviceEntry.objects.filter(device_id=device)
        else:
            device_entries = DeviceEntry.objects.filter(device_id=device,
                                                        datetime__range=[start_date, datetime.datetime.now()])

        device_entries = device_entries.order_by('datetime')

        datetimes = device_entries.values('datetime')
        battery_values = device_entries.values('battery')
        light_values = device_entries.values('light')

        writer = csv.writer(response)
        writer.writerow(['Date', 'Battery level', 'Light'])
        for i in range(0, len(datetimes)):  # datetimes and battery_values have the same size
            row = []
            # getting the dates
            date = json.dumps(datetimes[i])
            date = json.loads(date)
            date = date['datetime']
            date = date.encode("utf-8")
            old_format = '%Y-%m-%d %H:%M:%S.%f'
            new_format = '%Y/%m/%d %H:%M:%S'
            date = dt.strptime(date, old_format).strftime(new_format)
            row.append(date)

            batt = json.dumps(battery_values[i])
            batt = json.loads(batt)
            batt = batt['battery']
            row.append(batt)

            light = json.dumps(light_values[i])
            light = json.loads(light)
            light = light['light']
            row.append(light)

            writer.writerow(row)

        return response

    else :
        return "you did not receive a get in the csv_output_energy request"

@login_required()
def csv_output_meteo(request, id):

    if (request.method == 'GET'):
        start_date = switcher(request.GET['selected_period'])

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        device = Device.objects.get(id=id)  # get the device that is passed in
        if (start_date == "max"):
            device_entries = DeviceEntry.objects.filter(device_id=device)
        else:
            device_entries = DeviceEntry.objects.filter(device_id=device, datetime__range=[start_date, datetime.datetime.now()])

        device_entries = device_entries.order_by('datetime')

        datetimes = device_entries.values('datetime')
        humidity_values = device_entries.values('humidity')
        temperature_values = device_entries.values('temperature')
        pressure_values = device_entries.values('pressure')

        writer = csv.writer(response)
        writer.writerow(['Date', 'Humidity', 'Temperature', 'Pressure'])
        for i in range(0, len(datetimes)):  # datetimes and battery_values have the same size
            row = []
            # getting the dates
            date = json.dumps(datetimes[i])
            date = json.loads(date)
            date = date['datetime']
            date = date.encode("utf-8")
            old_format = '%Y-%m-%d %H:%M:%S.%f'
            new_format = '%Y/%m/%d %H:%M:%S'
            date = dt.strptime(date, old_format).strftime(new_format)
            row.append(date)

            humidity = json.dumps(humidity_values[i])
            humidity = json.loads(humidity)
            humidity = humidity['humidity']
            row.append(humidity)

            temperature = json.dumps(temperature_values[i])
            temperature = json.loads(temperature)
            temperature = temperature['temperature']
            row.append(temperature)

            pressure = json.dumps(pressure_values[i])
            pressure = json.loads(pressure)
            pressure = pressure['pressure']
            row.append(pressure)

            writer.writerow(row)

        return response

    else:
        return 'There was a problem in csv_output_meteo, apprently you didnt receive a get request'



@login_required()
def csv_output_accelerometer(request, id):

    if (request.method == 'GET'):
        start_date = switcher(request.GET['selected_period'])

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        device = Device.objects.get(id=id)  # get the device that is passed in
        if (start_date == "max"):
            device_entries = DeviceEntry.objects.filter(device_id=device)
        else:
            device_entries = DeviceEntry.objects.filter(device_id=device, datetime__range=[start_date, datetime.datetime.now()])

        device_entries = device_entries.order_by('datetime')

        datetimes = device_entries.values('datetime')
        accx_values = device_entries.values('accx')
        accy_values = device_entries.values('accy')
        accz_values = device_entries.values('accz')

        writer = csv.writer(response)
        writer.writerow(['Date', 'X axis', 'Y Axis', 'Z Axis'])
        for i in range(0, len(datetimes)):  # datetimes and battery_values have the same size
            row = []
            # getting the dates
            date = json.dumps(datetimes[i])
            date = json.loads(date)
            date = date['datetime']
            date = date.encode("utf-8")
            old_format = '%Y-%m-%d %H:%M:%S.%f'
            new_format = '%Y/%m/%d %H:%M:%S'
            date = dt.strptime(date, old_format).strftime(new_format)
            row.append(date)

            accx = json.dumps(accx_values[i])
            accx = json.loads(accx)
            accx = accx['accx']
            row.append(accx)

            accy = json.dumps(accy_values[i])
            accy = json.loads(accy)
            accy = accy['accy']
            row.append(accy)

            accz = json.dumps(accz_values[i])
            accz = json.loads(accz)
            accz = accz['accz']
            row.append(accz)

            writer.writerow(row)

        return response

    else:
        return 'There was a problem in csv_output_meteo, apprently you didnt receive a get request'


@login_required()
def csv_output_pressure(request, id):
    if (request.method == 'GET'):
        print request.GET['selected_period']
        start_date = switcher(request.GET['selected_period'])

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        device = Device.objects.get(id=id)

        if (start_date == "max"):
            device_entries = DeviceEntry.objects.filter(device_id=device)
        else:
            device_entries = DeviceEntry.objects.filter(device_id=device,
                                                        datetime__range=[start_date, datetime.datetime.now()])

        device_entries = device_entries.order_by('datetime')

        datetimes = device_entries.values('datetime')
        pressure_values = device_entries.values('pressure')

        writer = csv.writer(response)
        writer.writerow(['Date', 'Pressure'])
        for i in range(0, len(datetimes)):  # datetimes and battery_values have the same size
            row = []
            # getting the dates
            date = json.dumps(datetimes[i])
            date = json.loads(date)
            date = date['datetime']
            date = date.encode("utf-8")
            old_format = '%Y-%m-%d %H:%M:%S.%f'
            new_format = '%Y/%m/%d %H:%M:%S'
            date = dt.strptime(date, old_format).strftime(new_format)
            row.append(date)

            pressure = json.dumps(pressure_values[i])
            pressure = json.loads(pressure)
            pressure = pressure['pressure']
            row.append(pressure)

            writer.writerow(row)

        return response

    else :
        return "you did not receive a get in the csv_output_pressure request"

@login_required()
def onedevice_dashboard_historical(request, id):
    full_name = request.user.username
    device = Device.objects.get(id=id)
    device_entries = DeviceEntry.objects.filter(device_id=device).order_by('datetime')
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    return render(request, 'dashboard/oneDevice_historical_dashboard.html', {"full_name": full_name,
                                                                             "deviceNb": device.deviceNb,
                                                                             "deviceName": device.deviceName,
                                                                             "deviceType": device.deviceType,
                                                                             "deviceId": device.pk,
                                                                             "listOfDevices": listOfDevices
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


