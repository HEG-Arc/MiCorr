from django import forms
from django.forms import TextInput, FileInput
from .models import Artefact, Document, Metal, CorrosionForm, Environment, Origin, ChronologyPeriod, Alloy, Technology
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
        widgets = {
            'type': TextInput(),
            'recovering_date': TextInput(),
        }


class OriginCreateForm(forms.ModelForm):
    """
    Create a new origin
    """
    class Meta:
        model = Origin


class ChronologyCreateForm(forms.ModelForm):
    """
    Create a new chronology
    """
    class Meta:
        model = ChronologyPeriod


class AlloyCreateForm(forms.ModelForm):
    """
    Create a new alloy
    """
    class Meta:
        model = Alloy


class TechnologyCreateForm(forms.ModelForm):
    """
    Create a new technology
    """
    class Meta:
        model = Technology


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
    corrosion_form = django_filters.ModelChoiceFilter(label='Corrosion Form', queryset=CorrosionForm.objects.all(), empty_label='All Corrosion Forms')
    environment_new = django_filters.ModelChoiceFilter(label='Environment', queryset=Environment.objects.all(), empty_label='All Environments')

    class Meta:
        model = Artefact
        fields = ['metal1', 'corrosion_form', 'environment_new']