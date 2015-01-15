from django import forms
from .models import Artefact, Document, Metal, Corrosion, Environment
from tinymce.widgets import TinyMCE
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
class CorrosionChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
            return obj.form


class CorrosionChoiceFilter(django_filters.Filter):
    field_class = CorrosionChoiceField
"""


class ArtefactFilter(django_filters.FilterSet):
    """
    A filter which appears on top of the artefacts list template
    """
    metal1 = django_filters.ModelChoiceFilter(label='Metal Family', queryset=Metal.objects.filter(id__in=Artefact.objects.values_list("metal1").distinct()), empty_label='All Metal Families')
    corrosion = django_filters.ModelChoiceFilter(label='Corrosion Forms', queryset=Corrosion.objects.all(), empty_label='All Corrosion Forms')
    environment = django_filters.ModelMultipleChoiceFilter(label='Environments', queryset=Environment.objects.all())

    class Meta:
        model = Artefact
        fields = ['metal1', 'corrosion', 'environment']