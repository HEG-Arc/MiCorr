from django import forms
from django.forms import TextInput
from django.template.loader import render_to_string

from contacts.models import Contact

from .models import Artefact, Document, Metal, CorrosionForm, CorrosionType, Environment, Origin, ChronologyPeriod, \
    Alloy, Technology, Microstructure, RecoveringDate, Image, Type, Stratigraphy
from cities_light.models import Country
from tinymce.widgets import TinyMCE
import django_filters


class SelectWithPop(forms.Select):
    def render(self, name, *args, **kwargs):
        html = super(SelectWithPop, self).render(name, *args, **kwargs)
        popupplus = render_to_string("form/popupplus.html", {'field': name})
        return html+popupplus


class MultipleSelectWithPop(forms.SelectMultiple):
    def render(self, name, *args, **kwargs):
        html = super(MultipleSelectWithPop, self).render(name, *args, **kwargs)
        popupplus = render_to_string("form/popupplus.html", {'field': name})
        return html+popupplus


class ArtefactsUpdateForm(forms.ModelForm):
    """
    Update an existing artefact
    """

    complementary_information = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    macroscopic_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    sample_complementary_information = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    analyses_performed = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    metal_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    metal_complementary_information = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}),  required=False)
    corrosion_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    corrosion_complementary_information = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    synthesis_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    conclusion_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)
    references_text = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 10}), required=False)

    author = forms.ModelMultipleChoiceField(Contact.objects, widget=MultipleSelectWithPop, help_text='The author(s) of this file is (are) responsible for the information provided. Author(s) should provide their last name, initial of their first name and in brackets the abbreviation of their institutional affiliation, such as Degrigny C. (HE-Arc CR).', required=False)
    type = forms.ModelChoiceField(Type.objects, widget=SelectWithPop, help_text='The name of the artefact, its typology', required=False)
    origin = forms.ModelChoiceField(Origin.objects, widget=SelectWithPop, help_text='The place, city and country where the artefact comes from or the object to which the section considered belongs to', required=False)
    recovering_date = forms.ModelChoiceField(RecoveringDate.objects, widget=SelectWithPop, help_text='The date of excavation for archaeological objects, of production and use for other artefacts', required=False)
    chronology_period = forms.ModelChoiceField(ChronologyPeriod.objects, widget=SelectWithPop, help_text='The dating of the artefact', required=False)
    environment = forms.ModelChoiceField(Environment.objects, widget=SelectWithPop, help_text='The environment where the artefact was found.', required=False)
    location = forms.ModelChoiceField(Contact.objects, widget=SelectWithPop, help_text='The actual location of the artefact', required=False)
    owner = forms.ModelChoiceField(Contact.objects, widget=SelectWithPop, help_text='The owner of the artefact', required=False)
    alloy = forms.ModelChoiceField(Alloy.objects, widget=SelectWithPop, help_text='The alloy the artefact is made of', required=False)
    technology = forms.ModelChoiceField(Technology.objects, widget=SelectWithPop, help_text='The manufacturing techniques used to produce the artefact', required=False)
    sample_location = forms.ModelChoiceField(Contact.objects, widget=SelectWithPop, help_text='The actual location of the artefact sample', required=False)
    responsible_institution = forms.ModelChoiceField(Contact.objects, widget=SelectWithPop, help_text='The responsible institution for the artefact sample', required=False)
    microstructure = forms.ModelChoiceField(Microstructure.objects, widget=SelectWithPop, help_text='Microstructure of the metal', required=False)
    metal1 = forms.ModelChoiceField(Metal.objects, widget=SelectWithPop, help_text='The primary metal element of the artefact', required=False)
    metalx = forms.ModelMultipleChoiceField(Metal.objects, widget=MultipleSelectWithPop, help_text='The other metal elements of the artefact.', required=False)
    corrosion_form = forms.ModelChoiceField(CorrosionForm.objects, widget=SelectWithPop, required=False)
    corrosion_type = forms.ModelChoiceField(CorrosionType.objects, widget=SelectWithPop, help_text='', required=False)


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
            'chronology_period': TextInput(),
        }


class ImageCreateForm(forms.ModelForm):
    """
    Create a new image
    """

    class Meta:
        model = Image
        exclude = ['section']


class TypeCreateForm(forms.ModelForm):
    """
    Create a new type
    """

    class Meta:
        model = Type
        exclude = []


class OriginCreateForm(forms.ModelForm):
    """
    Create a new origin
    """

    class Meta:
        model = Origin
        exclude = []


class RecoveringDateCreateForm(forms.ModelForm):
    """
    Create a new origin
    """

    class Meta:
        model = RecoveringDate
        exclude = []


class ChronologyCreateForm(forms.ModelForm):
    """
    Create a new chronology
    """

    class Meta:
        model = ChronologyPeriod
        exclude = []


class EnvironmentCreateForm(forms.ModelForm):
    """
    Create a new alloy
    """

    class Meta:
        model = Environment
        exclude = []


class AlloyCreateForm(forms.ModelForm):
    """
    Create a new alloy
    """

    class Meta:
        model = Alloy
        exclude = []


class TechnologyCreateForm(forms.ModelForm):
    """
    Create a new technology
    """

    class Meta:
        model = Technology
        exclude = []


class MicrostructureCreateForm(forms.ModelForm):
    """
    Create a new microstructure
    """

    class Meta:
        model = Microstructure
        exclude = []


class MetalCreateForm(forms.ModelForm):
    """
    Create a new metal
    """

    class Meta:
        model = Metal
        exclude = []


class CorrosionFormCreateForm(forms.ModelForm):
    """
    Create a new corrosion form
    """

    class Meta:
        model = CorrosionForm
        exclude = []


class CorrosionTypeCreateForm(forms.ModelForm):
    """
    Create a new corrosion type
    """

    class Meta:
        model = CorrosionType
        exclude = []


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
