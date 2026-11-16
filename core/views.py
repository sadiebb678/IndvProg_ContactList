from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Contact

def dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        phone = request.POST.get('phone', '').strip()
        email = request.POST.get('email', '').strip()
        is_pinned = request.POST.get('is_pinned', '') == 'on'
      
        labels = request.POST.getlist('custom_label[]')
        values = request.POST.getlist('custom_value[]')
        custom_data = {
            label.strip(): val.strip()
            for label, val in zip(labels, values)
            if label.strip() and val.strip()
        }
        if name:
            Contact.objects.create(
                name=name,
                phone=phone,
                email=email,
                is_pinned=is_pinned,
                custom_fields=custom_data
            )
        return redirect('dashboard')
    
    contacts = Contact.objects.all().order_by('name')
    pinned_contacts = contacts.filter(is_pinned=True)[:4]
    
    return render(request, 'dashboard.html', {
        'contacts': contacts,
        'pinned_contacts': pinned_contacts,
        })

@require_POST
def toggle_pin(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    contact.is_pinned = not contact.is_pinned
    contact.save()
    return JsonResponse({'is_pinned': contact.is_pinned})

