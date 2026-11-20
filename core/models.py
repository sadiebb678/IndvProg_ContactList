from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    is_pinned = models.BooleanField(default=False)
    custom_fields = models.JSONField(default=dict, blank=True)
    avatar = models.TextField(blank=True, default='')    
    def __str__(self):
        return self.name