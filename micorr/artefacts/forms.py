from django import forms
from .models import Artefact


class UpdateForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fields = '__all__'


class CreateForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fields = '__all__'