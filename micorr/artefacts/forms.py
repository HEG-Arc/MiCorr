from django import forms
from .models import Artefact


class UpdateForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fields = ('inventory_number', 'description', 'metal')