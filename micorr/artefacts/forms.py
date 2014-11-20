from django import forms
from .models import Artefact, Document


class ArtefactsUpdateForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fields = '__all__'


class ArtefactsCreateForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fields = '__all__'


class DocumentUpdateForm(forms.ModelForm):
    """
    Update uploaded files with this form
    """
    class Meta:
        model = Document
        fields = '__all__'


class DocumentCreateForm(forms.ModelForm):
    """
    Load files with this form
    """
    class Meta:
        model = Document
        fields = '__all__'