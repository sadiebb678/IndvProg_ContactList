from django.shortcuts import render
from core.models import Contact

def dashboard(request):
    contacts = Contact.objects.all().order_by('name')
    pinned_contacts = contacts.filter(is_pinned=True)[:4]
    
    return render(request, 'dashboard.html', {
        'contacts': contacts,
        'pinned_contacts': pinned_contacts,
        })

