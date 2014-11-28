from django import forms
from .models import Artefact, Document, Metal, Corrosion, Environment
#from django.forms import ModelChoiceField
import django_filters


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

    """
    Works with the previous version of the metal class

    def __init__(self, *args, **kwargs):
        super(ArtefactsCreateForm, self).__init__(*args, **kwargs)
        self.fields['metal'].label_from_instance = lambda obj: "%s" % obj.primary_element
    """

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

"""
In order to display only part of the foreign key

class MetalChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
            return obj.primary_element


class MetalChoiceFilter(django_filters.Filter):
    field_class = MetalChoiceField
"""

class ArtefactFilter(django_filters.FilterSet):
    """
    A filter which appears on top of the artefacts list template
    """
    metal = django_filters.ModelChoiceFilter(label='Metal Family', queryset=Metal.objects.all(), empty_label='All Metal Families')
    corrosion = django_filters.ModelChoiceFilter(label='Corrosion Forms', queryset=Corrosion.objects.all(), empty_label='All Corrosion Forms')
    environment = django_filters.ModelMultipleChoiceFilter(label='Environments', queryset=Environment.objects.all())

    class Meta:
        model = Artefact
        fields = ['metal', 'corrosion', 'environment']