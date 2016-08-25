from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from userprofile.models import Device
from userprofile.models import DeviceEntry
import json
import requests
import datetime
from django.http import HttpResponse
from devicemanager.forms import EditDeviceForm
from django.views.decorators.csrf import csrf_exempt



@login_required()
def render_devicemanager_page(request):
    full_name = request.user.username
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    if request.method == 'POST':
        print "in the post edit device"
        edit_device_form = EditDeviceForm(request.POST)
        if edit_device_form.is_valid():
            devicetoedit = request.POST['deviceId']
            devicetoedit = Device.objects.get(id = devicetoedit)

            devicetoedit.deviceName = edit_device_form.cleaned_data['new_device_name']
            print devicetoedit.deviceName
            devicetoedit.save()
            return redirect('devicemanager')

    else:
        print "in the get edit device"
        edit_device_form = EditDeviceForm()

    return render(request, 'device_manager/device_manager.html', {"full_name": full_name,
                                                                  "listOfDevices": listOfDevices,
                                                                  "edit_device_form": edit_device_form
                                                                  })

@login_required()
def scan(request):
    r = requests.get("http://raspberrypi:8010/gap/nodes")
    r = json.loads(r.content)

    mylist = (r.values()[0])
    print mylist

    devices_found = []

    for i in range(len(mylist)):  # chaque mylist[i] est un python dictionnary de une ou deux valeurs
        key = 'name'
        print "----------"
        print mylist[i]
        if key in mylist[i]:  # just checking name, because a bluetooth device will always have an address
            device = {"name": mylist[i]['name'].encode("utf-8"), "address": mylist[i]['address'].encode("utf-8"), "rssi": mylist[i]['rssi']}
            devices_found.append(device)

        else:
            device = {"name": "bluetoothdevice-" + str(i), "address": mylist[i]['address'].encode("utf-8"), "rssi": mylist[i]['rssi']}
            devices_found.append(device)

    devices_found = json.dumps(devices_found)
    print "****************devices_found_in_scan_view***************"
    print devices_found


    return HttpResponse(devices_found)




@login_required()
def deletedevice(request):
    full_name = request.user.username
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    idtodelete = request.POST['deviceId']
    device = Device.objects.get(id=idtodelete)

    url = 'http://raspberrypi:8010/gatt/nodes/' + device.deviceNb + '/disconnect'
    print url
    requests.get('http://raspberrypi:8010/gatt/nodes/' + device.deviceNb +'/disconnect')


      # the unicode of devicelist, returns the deviceNb for each device
    device.delete()
    return render(request, 'device_manager/device_manager.html', {"full_name": full_name,
                                                                  "listOfDevices": listOfDevices
                                                                  })

@login_required()
@csrf_exempt #will have to change this in the future for security reasons
def adddevice(request): #this is not working
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    #take care of the new device added
    if request.method == 'POST' :
        myString = request.POST['device']
        myArray = myString.split(',')
        name = myArray[0]
        address = myArray[1]

    try:
        device = Device.objects.get(deviceNb=address)
    except Device.DoesNotExist:
        device = Device.objects.create(deviceNb = address, deviceType = "ENVIRO", user_id = userid, deviceName = name, deviceStatus="connected")
        now = datetime.datetime.now()
        d = DeviceEntry(datetime=now, pressure=0, humidity=0, device_id=device.id ,accx=0, accy=0, accz=0, battery=0, light=0, temperature=0)
        d.save()


        print "great! The device has been created and belongs to you now"
        requests.get('http://raspberrypi:8010/gatt/nodes/' + address) # request connection to that device
        print "Sending HTTP GET to " + "http://raspberrypi:8001/gatt/nodes/" + address
        return redirect('devicemanager')
    else: # if the device exists in database
        print device.user_id
        if (device.user_id == userid) :
            print "You already own that device"
        else:
            print "That device belongs to someone else"


    return redirect('devicemanager')



@login_required()
def devicesettings(request, id):
    device = Device.objects.get(id = id)
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)
    address = device.deviceNb


    if request.method == 'POST': #if the user changes the settings
        requestdict = request.POST.dict()
        if (str(requestdict['formdata']) == "accelerometer"):
            if 'checkbox-accelerometer' in requestdict:
                print requestdict['accelerometer-rangeslider']
                slider_value = int(float(requestdict['accelerometer-rangeslider'])*10)
                slider_value = str(slider_value)
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa82/value/1'
                url_slider = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa83/value/' + slider_value
                print "url checkbox"
                print url_checkbox

                print "url slider"
                print url_slider

                r = requests.put(url_checkbox)
                b = requests.put(url_slider)
            else:
                print "The box is checked off"
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa82/value/0'
                r = requests.put(url_checkbox)

        elif (str(request.POST['formdata']) == "weather"):
            if 'checkbox-weather' in requestdict:
                slider_value = int(float(requestdict['weather-rangeslider']) * 10)
                slider_value = str(slider_value)
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa42/value/1'
                url_slider = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa44/value/' + slider_value
                r = requests.put(url_checkbox)
                b = requests.put(url_slider)
            else:
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa42/value/0'
                r = requests.put(url_checkbox)

        elif (str(request.POST['formdata']) == "light"):
            if 'checkbox-light' in requestdict :
                slider_value = int(float(requestdict['light-rangeslider']) * 10)
                slider_value = str(slider_value)
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa22/value/1'
                print "-----------------LIGHT URL-------------------"
                print url_checkbox
                url_slider = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa23/value/' + slider_value
                r = requests.put(url_checkbox)
                b = requests.put(url_slider)
            else:
                url_checkbox = 'http://raspberrypi:8010/gatt/nodes/' + address + '/characteristics/aa22/value/0'
                r = requests.put(url_checkbox)
        else:
            print "shit happened"


    response = requests.get('http://raspberrypi:8010/gatt/nodes/' + address + '/settings')
    weatherOn = json.loads(response.content)['weatherConf']
    weatherPeriod = json.loads(response.content)['weatherPeriod']
    accelerometerOn = json.loads(response.content)['accelerometerConf']  # 0 off 1 on
    accelerometerPeriod = json.loads(response.content)['accelerometerPeriod']  # 0 off 1 on
    lightOn = json.loads(response.content)['lightConf']  # 0 off 1 on
    lightPeriod = json.loads(response.content)['lightPeriod']  # 0 off 1 on

    settings_dict = {'weatherOn': (int(weatherOn) == 1), 'weatherPeriod': float(weatherPeriod) / 10 , 'accelerometerOn': (int(accelerometerOn) ==1),
                     'accelerometerPeriod': float(accelerometerPeriod) / 10, 'lightOn': (int(lightOn) == 1), 'lightPeriod': float(lightPeriod) / 10}

    settings = json.dumps(settings_dict)

    return render(request, 'device_manager/device_settings.html', {"device": device,
                                                                   "listOfDevices": listOfDevices,
                                                                   "settings": settings})



