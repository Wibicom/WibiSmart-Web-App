from django.db.models import Avg
from django.db.models import Max
from django.db.models import Min
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
#from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User

from django.template.response import TemplateResponse

import csv
import datetime
import requests

import json
from datetime import datetime as dt
from datetime import timedelta
from userprofile.models import Device
from userprofile.models import DeviceEntry

#this function calculates the daily data transfer (entries per minute) for a specific device
def calculate_lastmin_data_transfer(request,device):
    now = datetime.datetime.now()
    minute_ago = now - datetime.timedelta(minutes=1)

    entries_last_minute = DeviceEntry.objects.filter(device_id=device.id, datetime__range=[minute_ago,now]).count()

    return entries_last_minute

#this function calculates the nb of weekly entries and calculates the delta compared to last week, populates the data
#transfer top tile in live dashboard page
def calculate_weekly_entries_data(request,device):
    today = datetime.datetime.now()
    seven_days_earlier = today - timedelta(days=7)
    fourteen_days_earlier = today - timedelta(days = 14)

    #nb of entries this week
    nb_weekly_entries = DeviceEntry.objects.filter(device_id=device.id, datetime__range=[seven_days_earlier, today]).count()

    #nb of entries last week
    nb_entries_previous_week = DeviceEntry.objects.filter(device_id=device.id, datetime__range=[fourteen_days_earlier, seven_days_earlier]).count()

    if (nb_entries_previous_week !=0):
        weekly_entries_delta = ((nb_weekly_entries-nb_entries_previous_week)/nb_entries_previous_week)*100
    else:
        weekly_entries_delta = "--"

    nb_weekly_entries = "{:,}".format(nb_weekly_entries)
    dict = {'weekly_entries' : nb_weekly_entries, 'weekly_entries_delta': weekly_entries_delta}

    return dict

def calculate_daily_temp(request, device):
    today = datetime.datetime.now().date()
    daily_temp_avrg = DeviceEntry.objects.filter(datetime__date= today, device_id=device).aggregate(Avg('temperature'))
    daily_temp_max = DeviceEntry.objects.filter(datetime__date=today, device_id=device).aggregate(Max('temperature'))
    daily_temp_min = DeviceEntry.objects.filter(datetime__date=today, device_id=device).aggregate(Min('temperature'))

    print "*******************"
    print type(daily_temp_avrg['temperature__avg'])
    daily_temp_avrg = round(float(daily_temp_avrg['temperature__avg']), 2)
    daily_temp_max = round(float(daily_temp_max['temperature__max']), 2)
    daily_temp_min = round(float(daily_temp_min['temperature__min']), 2)


    dict = {'daily_temp_avrg': daily_temp_avrg, 'daily_temp_max': daily_temp_max, 'daily_temp_min': daily_temp_min}
    return dict

#@login_required()
def calculate_battery_autonomy(isConnected, periodConnected, periodWeather, periodAdc, periodAccel, batteryLevel):
    print "*********MYPARAMETERS****************"
    print isConnected
    print periodConnected
    print periodWeather
    print periodAdc
    print periodAccel
    print batteryLevel
    sleepCurrent = 1.8  # uA

    # Advertising data
    advertLess1_5_Current = 4410
    advertLess1_5_Time = 4.53
    advertMore1_5_Current = 3630
    advertMore1_5_Time = 6.11

    # Connection Data
    connLess1_5_Current = 3666
    connLess1_5_Time = 2.46
    connMore1_5_Current = 2860
    connMore1_5_Time = 4.31

    # Battery data
    battMeasure_Current = 1772
    battMeasure_Time = 3.34

    # Weather
    weatherSleep_Current = 0.2
    weatherMeasure_Current = 3198
    weatherMeasure_Time = 2.93
    weatherLess1_5_tx_Current = 4299
    weatherLess1_5_tx_Time = 2.90
    weatherMore1_5_tx_Current = 4006
    weatherMore1_5_tx_Time = 3.31

    # Adc
    adcMeasure_Current = 1624
    adcMeasure_Time = 6.81
    adcLess1_5_tx_Current = 3764
    adcLess1_5_tx_Time = 2.69
    adcMore1_5_tx_Current = 3600
    adcMore1_5_tx_Time = 2.44

    # Accelerometer
    accelSleep_Current = 1
    accelMeasureBMA_Current = 3065
    accelMeasureBMA_Time = 1.18
    accelMeasureI2C_Current = 3130
    accelMeasureI2C_Time = 2.59
    accelLess1_5_tx_Current = 3708
    accelLess1_5_tx_Time = 2.35
    accelMore1_5_tx_Current = 3528
    accelMore1_5_tx_Time = 3.14

    avgCurrent = 0
    default_periodConnected = 30000  # 30s

    # if one of the period is 0, it means the sensor is off.

    periodBattery = 150000  # set on 15s

    avgBatteryCurrent = (
    battMeasure_Current * battMeasure_Time)  # + sleepCurrent*(periodConnected -  weatherMeasure_Time)/ periodConnected
    avgWeatherCurrent = (
    weatherMeasure_Time * weatherMeasure_Current)  # + sleepCurrent*(periodConnected -  weatherMeasure_Time)/ periodConnected
    avgAdcCurrent = (
    adcMeasure_Current * adcMeasure_Time)  # + sleepCurrent*(periodConnected -  adcMeasure_Time)  )/periodConnected
    avgAccelCurrent = (
    accelMeasureBMA_Current * accelMeasureBMA_Time + accelMeasureI2C_Current + accelMeasureI2C_Time)  # + sleepCurrent*(periodConnected - accelMeasureBMA_Time - accelMeasureI2C_Time))/periodConnected

    # check if sleepMode
    if periodConnected == 0:
        periodConnected = default_periodConnected
        periodAccel = 0
        periodAdc = 0
        periodWeather = 0

    if isConnected == 0:  # ie advertising, no sensor is on, except the battery
        if periodConnected < 1500:
            avgCurrent = (
                         advertLess1_5_Current * advertLess1_5_Time + battMeasure_Current * battMeasure_Time + sleepCurrent * (
                         periodConnected - advertLess1_5_Time - battMeasure_Time)) / periodConnected
        else:
            avgCurrent = (
                         advertMore1_5_Current * advertMore1_5_Time + battMeasure_Current * battMeasure_Time + sleepCurrent * (
                         periodConnected - advertMore1_5_Time - battMeasure_Time)) / periodConnected
    # else : connected state
    else:
        if periodConnected < 1500:
            avgCurrent = connLess1_5_Current * connLess1_5_Time + sleepCurrent * (
            periodConnected - connLess1_5_Time - periodBattery - periodWeather - periodAdc - periodAccel)
            print "****AVG CURRENT 1"
            print avgCurrent
        else:
            avgCurrent = connMore1_5_Current * connMore1_5_Time + sleepCurrent * (
            periodConnected - connMore1_5_Time - periodBattery - periodWeather - periodAdc - periodAccel)

        avgCurrent += avgBatteryCurrent * periodBattery + avgWeatherCurrent * periodWeather + avgAdcCurrent * periodAdc + avgAccelCurrent * periodAccel
        avgCurrent = avgCurrent / periodConnected
        print "**********************************avgCurrent*******************************************************"
        print avgCurrent


        # evaluate the remaining capacity of the battery
    batteryLevelVolts = 2 + batteryLevel / 100.0

    print "*********************batteryLevelVolts*****************************************************"
    print batteryLevelVolts
    battCapacity = -32 * pow(batteryLevelVolts,4) + 301.87 * pow(batteryLevelVolts,3) - 1041.5 * pow(batteryLevelVolts,2) + 1562.8 * batteryLevelVolts - 862  # in mAh
    print "***************************BAtt capacity*************************************************"
    print battCapacity

    lifeExpectancy = battCapacity / (avgCurrent / 1000)

    return lifeExpectancy  # in Hours



#Generates the live dashboard
@login_required()
def onedevice_dashboard(request, id):
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

    #print last_ten_entries
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


    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    entries_last_minute = calculate_lastmin_data_transfer(request,device)
    weekly_entries_data = calculate_weekly_entries_data(request,device)
    daily_temp_data = calculate_daily_temp(request, device)

    print "WEEKLY ENTRIES"
    print weekly_entries_data


    isConnected = 1 #device.deviceStatus #change this later to pass a boolean
    periodConnected = 100

    device_entries = DeviceEntry.objects.filter(device_id=device).order_by('datetime')
    last_entry = device_entries.latest('datetime')

    print 'http://192.168.1.200:8010/gatt/nodes/' + device.deviceNb + '/settings'
    response = requests.get('http://192.168.1.200:8010/gatt/nodes/' + device.deviceNb + '/settings')
    periodWeather = 0 #int(json.loads(response.content)['weatherPeriod'])*100
    periodAdc = 0 #int(json.loads(response.content)['lightPeriod'])*100
    periodAccel =0 #int(json.loads(response.content)['accelerometerPeriod'])*100
    batteryLevel = last_entry.battery

    autonomy = calculate_battery_autonomy(isConnected, periodConnected, periodWeather, periodAdc, periodAccel, batteryLevel)

    return TemplateResponse(request, 'dashboard/device_dashboard.html', {"full_name": full_name,
                                                                              "deviceId": device.pk,
                                                                              "device_entries": device_entries,
                                                                              "listOfDevices": listOfDevices,
                                                                              "temperaturelist": temperaturelist,
                                                                              "accxlist": accxlist,
                                                                              "accylist": accylist,
                                                                              "acczlist": acczlist,
                                                                              "entries_last_minute": entries_last_minute,
                                                                              "weekly_entries": weekly_entries_data['weekly_entries'],
                                                                              "weekly_entries_delta": weekly_entries_data['weekly_entries_delta'],
                                                                              "daily_temp_avrg" : daily_temp_data['daily_temp_avrg'],
                                                                              "daily_temp_min" : daily_temp_data['daily_temp_min'],
                                                                              "daily_temp_max": daily_temp_data[ 'daily_temp_max'],
                                                                              "autonomy": autonomy
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
            date = datetimes[i]['datetime'].strftime('%Y/%m/%d %H:%M:%S')
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
        writer.writerow(['Date', 'Humidity', 'Temperature'])
        for i in range(0, len(datetimes)):  # datetimes and battery_values have the same size
            row = []
            # getting the dates
            date = datetimes[i]['datetime'].strftime('%Y/%m/%d %H:%M:%S')
            row.append(date)

            humidity = json.dumps(humidity_values[i])
            humidity = json.loads(humidity)
            humidity = humidity['humidity']
            row.append(humidity)

            temperature = json.dumps(temperature_values[i])
            temperature = json.loads(temperature)
            temperature = temperature['temperature']
            row.append(temperature)


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
            date = datetimes[i]['datetime'].strftime('%Y/%m/%d %H:%M:%S')
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
            date = datetimes[i]['datetime'].strftime('%Y/%m/%d %H:%M:%S')
            row.append(date)

            pressure = json.dumps(pressure_values[i])
            pressure = json.loads(pressure)
            pressure = pressure['pressure']
            row.append(pressure)

            writer.writerow(row)

        return response

    else :
        return "you did not receive a get in the csv_output_pressure request"

#this renders the historical dashboard page, it receives the device id in parameters
@login_required()
def onedevice_dashboard_historical(request, id):
    user = request.user
    full_name = user.username
    userid = user.pk

    device = Device.objects.get(id=id)
    device_entries = DeviceEntry.objects.filter(device_id=device.id).order_by('datetime')
    inception = device_entries.earliest('datetime').datetime.strftime('%Y/%m/%d')
    listOfDevices = Device.objects.filter(user_id=userid)

    total_entries = "{:,}".format(len(device_entries)) #this is used to format numbers by comma separating values by the 1000

    today = datetime.datetime.now()
    seven_days_earlier = today - timedelta(days=7)
    weekly_entries = DeviceEntry.objects.filter(device_id=device.id, datetime__range=[seven_days_earlier, today]).count()

    return render(request, 'dashboard/device_historical_dashboard.html', {"full_name": full_name,
                                                                            "device": device,
                                                                             "deviceType": device.deviceType,
                                                                             "deviceId": device.pk,
                                                                             "listOfDevices": listOfDevices,
                                                                             "inception": inception,
                                                                             "total_entries": total_entries,
                                                                             "weekly_entries": weekly_entries

                                                                             })




@login_required()
def onedevice_dashboard_ajax(request, id):
    #print "im in ajax"
    #rendering data ajax call
    device = Device.objects.get(id = id)
    device_entries = DeviceEntry.objects.filter(device_id=device).order_by('datetime')


    last_entry = device_entries.latest('datetime')

    live_battery = last_entry.battery
    live_humidity = last_entry.humidity
    live_pressure = last_entry.pressure
    live_temperature = last_entry.temperature
    live_accx = last_entry.accx
    live_accy = last_entry.accy
    live_accz = last_entry.accz
    live_rssi = last_entry.rssi
    live_light = last_entry.light
    live_deviceStatus = device.deviceStatus



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
        response_data['live_light'] = live_light
        response_data['live_rssi'] = live_rssi
        response_data['live_deviceStatus'] = live_deviceStatus

    except:
        response_data['result'] = "Failure"
        response_data['message'] = "it did not work"

    return HttpResponse(json.dumps(response_data), content_type ="application/json")


