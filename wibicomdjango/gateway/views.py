from django.shortcuts import render
import subprocess
from subprocess import *
import requests


def get_gateway_data(request):


    r= requests.get("http://raspberrypi:8000/gap/nodes")
    print r.content


    return render(request, 'gateway/view_gateway.html', {})
