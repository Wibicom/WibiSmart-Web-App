from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from userprofile.models import Device
from userprofile.models import DeviceEntry
import json
import requests
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
    r = requests.get("http://raspberrypi:8001/gap/nodes")
    r = json.loads(r.content)

    mylist = (r.values()[0])
    print mylist

    devices_found = []

    for i in range(len(mylist)):  # chaque mylist[i] est un python dictionnary de une ou deux valeurs
        key = 'name'
        print "----------"
        print mylist[i]
        if key in mylist[i]:  # just checking name, because a bluetooth device will always have an address
            device = {"name": mylist[i]['name'].encode("utf-8"), "address": mylist[i]['address'].encode("utf-8")}
            devices_found.append(device)

        else:
            pass

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

    Device.objects.get(id=idtodelete).delete()  # the unicode of devicelist, returns the deviceNb for each device

    return render(request, 'device_manager/device_manager.html', {"full_name": full_name,
                                                                  "listOfDevices": listOfDevices
                                                                  })

@login_required()
@csrf_exempt #will have to change this in the future for security reasons
def adddevice(request): #this is not working
    
    userid = request.user.pk
    if request.method == 'POST' :
        myString = request.POST['device']
        myArray = myString.split(',')
        name = myArray[0]
        address = myArray[1]

    try:
        device = Device.objects.get(deviceNb=address)
    except Device.DoesNotExist:
        device = Device.objects.create(deviceNb = address, deviceType = "ENVIRO", user_id = userid, deviceName = name)
        print "great! The device has been created and belongs to you now"
        requests.get('http://raspberrypi:8001/gatt/nodes/' + address) # request connection to that device
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

    # Get current device settings 

    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa42/value')
    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa44/value')

    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa82/value')
    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa83/value')

    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa22/value')
    # accelerometerOn = requests.get('http://raspberrypi:8001/gatt/nodes/' + address + '/characteristics/aa23/value')


    return render(request, 'device_manager/device_settings.html', {"device": device,  "listOfDevices": listOfDevices})



