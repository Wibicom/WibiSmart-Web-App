from django.shortcuts import render

# Create your views here.

#from django.http import HttpResponse
#typically don't do this for a complex webpage
#def index(request):
    #return HttpResponse(" <h1> This is the music app homepage </h1>" )

from django.template.response import TemplateResponse

#this is for querrying the database
from home.models import User
from django.shortcuts import get_object_or_404

#the curly braces are dictionnaries for passing data from server to client
'''
def index(request):
    myString = "this is a python string"

    #querrying the database
    #data = User.objects.all()
    data = User.objects.filter(firstName = "Mina") #filter can return multiple entries
    #you can use get instead of filter to have a single object

    data2 = User.objects.get(pk=1) #pk stands for primary key
    return TemplateResponse(request, 'home/index.html', {"myString": myString , "data": data, "data2": data2})
'''
def index(request, user_id):
    data = get_object_or_404(User, pk=user_id)
    return TemplateResponse(request, 'home/index.html', {"data": data, })

def showHome(request):
    return TemplateResponse(request, 'home/home.html')