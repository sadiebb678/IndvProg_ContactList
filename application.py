import os
from django.core.wsgi import get_wsgi_application

# Point Django to project configuration
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# AWS looks for this specifically
application = get_wsgi_application()