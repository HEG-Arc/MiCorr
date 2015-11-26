from django.views import generic
from .models import Contact
from .forms import ContactCreateForm


class ContactCreateView(generic.CreateView):
    """
    A view which allows the user to create a technology
    When the chronology is created, it redirects the user to the artefact list
    """
    model = Contact
    template_name_suffix = '_create_form'
    form_class = ContactCreateForm