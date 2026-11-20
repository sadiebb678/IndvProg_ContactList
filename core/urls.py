"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
        path('', views.dashboard, name='dashboard'),
        path('edit/<int:pk>/', views.edit_contact, name='edit_contact'),
        path('delete/<int:pk>/', views.delete_contact, name='delete_contact'),
        path('characteristics/add/', views.add_characteristic, name='add_characteristic'),
        path('characteristics/manage/', views.manage_characteristics, name='manage_characteristics'),
        path('toggle-pin/<int:pk>/', views.toggle_pin, name='toggle_pin'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)