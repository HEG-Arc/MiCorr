from django import forms
from .models import Artefact, Document, Metal, Corrosion, Environment
from tinymce.widgets import TinyMCE
#from django.forms import ModelChoiceField
import django_filters


class ArtefactsUpdateForm(forms.ModelForm):
    """
    Update an existing artefact
    """
    description = forms.CharField(widget=TinyMCE(attrs={'cols': 20, 'rows': 30}))

    class Meta:
        model = Artefact
        exclude = ['user']


class ArtefactsCreateForm(forms.ModelForm):
    """
    Create a new artefact
    """
    class Meta:
        model = Artefact
        exclude = ['user']

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


class CorrosionChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
            return obj.form


class CorrosionChoiceFilter(django_filters.Filter):
    field_class = CorrosionChoiceField


class ArtefactFilter(django_filters.FilterSet):
    """
    A filter which appears on top of the artefacts list template
    """
    metal = django_filters.ModelChoiceFilter(label='Metal Family', queryset=Metal.objects.all(), empty_label='All Metal Families')
    corrosion = CorrosionChoiceFilter(label='Corrosion Forms', queryset=Corrosion.objects.all(), empty_label='All Corrosion Forms')
    environment = django_filters.ModelMultipleChoiceFilter(label='Environments', queryset=Environment.objects.all())

    class Meta:
        model = Artefact
        fields = ['metal', 'corrosion', 'environment']