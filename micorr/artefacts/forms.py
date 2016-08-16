from django import forms
from django.db.transaction import commit
from django.forms import TextInput
from .models import Artefact, Document, Metal, CorrosionForm, CorrosionType, Environment, Origin, ChronologyPeriod, \
    Alloy, Technology, Microstructure
from cities_light.models import Country
from tinymce.widgets import TinyMCE
import django_filters


class ArtefactsUpdateForm(forms.ModelForm):
    """
    Update an existing artefact
    """

    complementary_information = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    macroscopic_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))

    """
    object_image = forms.ImageField()
    zones_image = forms.ImageField()
    macroscopic_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    macroscopic_image = forms.ImageField()
    sample_image = forms.ImageField()
    metal_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    metal_image = forms.ImageField()
    corrosion_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    corrosion_image = forms.ImageField()
    synthesis_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    synthesis_image = forms.ImageField()
    conclusion_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    conclusion_image = forms.ImageField()
    references_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}))
    """

    class Meta:
        model = Artefact
        exclude = ['user']

    def save(self):
        self.complementary_information = self.cleaned_data['complementary_information']
        super(ArtefactsUpdateForm, self).save(commit=commit)



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
            'chronology_period': TextInput(),
        }


class OriginCreateForm(forms.ModelForm):
    """
    Create a new origin
    """

    class Meta:
        model = Origin


class EnvironmentCreateForm(forms.ModelForm):
    """
    Create a new alloy
    """

    class Meta:
        model = Environment


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


class MicrostructureCreateForm(forms.ModelForm):
    """
    Create a new microstructure
    """

    class Meta:
        model = Microstructure


class MetalCreateForm(forms.ModelForm):
    """
    Create a new metal
    """

    class Meta:
        model = Metal


class CorrosionFormCreateForm(forms.ModelForm):
    """
    Create a new corrosion form
    """

    class Meta:
        model = CorrosionForm


class CorrosionTypeCreateForm(forms.ModelForm):
    """
    Create a new corrosion type
    """

    class Meta:
        model = CorrosionType


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
    A filter which appears on top of the artefacts list
    """
    origin__city__country = django_filters.ModelChoiceFilter(label='Country', queryset=Country.objects.filter(
        id__in=Artefact.objects.values_list("origin__city__country").distinct()), empty_label='All Countries')
    metal1 = django_filters.ModelChoiceFilter(label='Metal Family', queryset=Metal.objects.filter(
        id__in=Artefact.objects.values_list("metal1").distinct()), empty_label='All Metal Families')
    corrosion_form = django_filters.ModelChoiceFilter(label='Corrosion Forms', queryset=CorrosionForm.objects.filter(
        id__in=Artefact.objects.values_list("corrosion_form")), empty_label='All Corrosion Forms')
    environment = django_filters.ModelChoiceFilter(label='Environment', queryset=Environment.objects.all(),
                                                   empty_label='All Environments')

    class Meta:
        model = Artefact
        fields = ['origin__city__country', 'metal1', 'corrosion_form', 'environment']
