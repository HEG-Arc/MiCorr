from django import forms
from .models import Contact


class ContactCreateForm(forms.ModelForm):
    """
    Create a new technology
    """
    class Meta:
        model = Contact
        exclude = ['user', 'parent']