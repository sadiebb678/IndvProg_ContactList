from django.shortcuts import render
from core.models import Contact

def dashboard(request):
    contacts = [
        {  'name': 'Alice Smith',
            'role': 'Developer',
            'email': 'alice@example.com',
            'phone': '555-0100',}
    ]
    pinned_contacts = contacts.filter(is_pinned=True)[:4]
    
    return render(request, 'dashboard.html', {
        'contacts': contacts,
        'pinned_contacts': pinned_contacts,
        })

