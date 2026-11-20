from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Contact


def dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        phone = request.POST.get('phone', '').strip()
        email = request.POST.get('email', '').strip()
        avatar_data = request.POST.get('avatar_data', '').strip()
        is_pinned = request.POST.get('is_pinned') == 'on'
        
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
                avatar=avatar_data,
                is_pinned=is_pinned,
                custom_fields=custom_data
            )
        return redirect('dashboard')

    contacts = Contact.objects.all().order_by('name')
    pinned_contacts = contacts.filter(is_pinned=True)[:4]

    all_keys = set()
    for c in contacts:
        if c.custom_fields:
            all_keys.update(c.custom_fields.keys())

    return render(request, 'dashboard.html', {
        'contacts': contacts,
        'pinned_contacts': pinned_contacts,
        'characteristic_keys': sorted(all_keys),
    })

@require_POST
def edit_contact(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    name = request.POST.get('name', '').strip()
    if name:
        contact.name = name
        contact.phone = request.POST.get('phone', '').strip()
        contact.email = request.POST.get('email', '').strip()
        avatar_data = request.POST.get('avatar_data', '').strip()
        if avatar_data:
            contact.avatar = avatar_data
        contact.is_pinned = request.POST.get('is_pinned') == 'on'

        labels = request.POST.getlist('custom_label[]')
        values = request.POST.getlist('custom_value[]')
        contact.custom_fields = {
            label.strip(): val.strip()
            for label, val in zip(labels, values)
            if label.strip() and val.strip()
        }
        contact.save()
    return redirect('dashboard')

@require_POST
def delete_contact(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    contact.delete()
    return redirect('dashboard')

@require_POST
def add_characteristic(request):
    char_name = request.POST.get('char_name', '').strip()
    default_val = request.POST.get('default_val', '').strip() or 'N/A'

    if char_name:
        for contact in Contact.objects.all():
            fields = contact.custom_fields or {}
            if char_name not in fields:
                fields[char_name] = default_val
                contact.custom_fields = fields
                contact.save()
    return redirect('dashboard')

@require_POST
def manage_characteristics(request):
    action = request.POST.get('action')
    old_key = request.POST.get('old_key', '').strip()
    new_key = request.POST.get('new_key', '').strip()

    if old_key:
        for contact in Contact.objects.all():
            if contact.custom_fields and old_key in contact.custom_fields:
                updated_fields = dict(contact.custom_fields)
                val = updated_fields.pop(old_key)
                if action == 'rename':
                    target_key = new_key if new_key else old_key
                    updated_fields[target_key] = val
                contact.custom_fields = updated_fields
                contact.save(update_fields=['custom_fields'])
    return redirect('dashboard')

@require_POST
def toggle_pin(request, pk):
    contact = get_object_or_404(Contact, pk=pk)
    contact.is_pinned = not contact.is_pinned
    contact.save()
    return JsonResponse({'is_pinned': contact.is_pinned})
