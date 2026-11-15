from django.shortcuts import render
from .models import Contact

def dashboard(request):
    contacts = Contact.objects.all().order_by('name')
    return render(request, 'dashboard.html', {'contacts': contacts})
