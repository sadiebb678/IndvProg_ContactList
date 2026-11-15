from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'email', 'phone')
    search_fields = ('name', 'role', 'email')