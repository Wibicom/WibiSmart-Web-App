from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from userprofile.models import Device
from userprofile.models import DeviceEntry

@login_required()
def render_devicemanager_page(request):
    full_name = request.user.username
    userid = request.user.pk
    listOfDevices = Device.objects.filter(user_id=userid)

    return render(request, 'device_manager/device_manager.html', {"full_name": full_name,
                                                                             "listOfDevices": listOfDevices
                                                                             })