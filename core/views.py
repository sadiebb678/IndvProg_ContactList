# core/views.py
import requests
from django.http import HttpResponse

def home_view(request):
    return HttpResponse("Contact List App is Running!")
