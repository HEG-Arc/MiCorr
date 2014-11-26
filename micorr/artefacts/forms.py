from django import forms
from .models import Artefact, Document


class ArtefactsUpdateForm(forms.ModelForm):
    """
    Update an existing artefact
    """
    class Meta:
        model = Artefact
        fields = '__all__'


class ArtefactsCreateForm(forms.ModelForm):
    """
    Create a new artefact
    """
    class Meta:
        model = Artefact
        fields = '__all__'


class DocumentUpdateForm(forms.ModelForm):
    """
    Update uploaded files
    """
    class Meta:
        model = Document
        exclude = ['artefact']


class DocumentCreateForm(forms.ModelForm):
    """
    Load files
    """
    class Meta:
        model = Document
        exclude = ['artefact']