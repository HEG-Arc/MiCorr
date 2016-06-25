from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from .views import ContactCreateView

urlpatterns = [
    url(r'^create/$', login_required(ContactCreateView.as_view()), name='contact-create'),
]

