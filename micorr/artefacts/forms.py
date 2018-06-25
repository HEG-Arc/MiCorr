from collections import OrderedDict
from itertools import chain

from django import forms
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.forms import TextInput
from django.template.loader import render_to_string
from django.urls import reverse_lazy

from users.models import User

from .models import Artefact, Document, Metal, CorrosionForm, CorrosionType, Environment, Object, Origin, ChronologyPeriod, \
    Alloy, Technology, Microstructure, RecoveringDate, Image, Type, Stratigraphy, Token, Collaboration_comment, \
    Publication
from cities_light.models import Country, City
from dal import autocomplete
from tinymce.widgets import TinyMCE
import django_filters
from .fieldset_form import FieldsetForm

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

def get_updated_widgets(widgets, model_class, fields):
    """
    Updates ModelForm.Meta widgets dictionary for all ForeignKey/ManyToManyField fields of a model_class
    to use dal-autocomplete instead of standard widgets
    :param widgets: existing widgets attribute of Form Meta class or empty initial dict
    :param model_class: Model class to check the type of fields
    :param fields: list of field names to adapt in the form
    :return: updated input widgets dict
    """
    def get_url_name(model_name):
        m2u = {
            'RecoveringDate': 'artefacts:date-autocomplete',
            'CorrosionType': 'artefacts:type-autocomplete',
            'CorrosionForm': 'artefacts:form-autocomplete',
            'Metal': 'artefacts:element-autocomplete',
        }
        return m2u.get(model_name, 'artefacts:generic-autocomplete')
    for f_name in fields:
        for meta_field in model_class._meta.get_fields():
            if f_name == meta_field.name:
                if meta_field.db_type.im_class == ForeignKey:
                    rel_model_name = meta_field.related_model.__name__
                    widgets[f_name] = SelectWithPop if rel_model_name in ('Origin',) else\
                        autocomplete.ModelSelect2Multiple(url=reverse_lazy(get_url_name(rel_model_name), args=[rel_model_name]))
                elif meta_field.db_type.im_class == ManyToManyField:
                    widgets[f_name] = autocomplete.ModelSelect2Multiple(
                        url=reverse_lazy('artefacts:generic-autocomplete',
                                         args=[meta_field.related_model.__name__]))
    return widgets

class ArtefactsForm(FieldsetForm):

    class Meta:
        model = Artefact
        fieldsets = (
            {
                "name": "authors",
                "title": None,
                "is_fieldset": True,
                "fields": [
                    'author',
                ]
            },
            {
                "name": "description",
                "title": None,
                "is_fieldset": True,
                "fields": [
                    'description',
                    'type',  # fk
                    'origin',  # fk
                    'recovering_date',  # fk
                    'chronology_period',  # fk
                    'environment',  # fk
                    'location',  # fk
                    'owner',  # fk
                    'inventory_number',
                    'recorded_conservation_data',
                ]
            },
            {
                "name": "sample",
                "title": u"optional fields",
                "is_fieldset": True,
                "fields": [
                    'sample_description',
                    'alloy',  # fk
                    'technology',  # fk
                    'sample_number',
                    'sample_location',  # fk
                    'responsible_institution',  # fk
                    'date_aim_sampling']
            },
            {
                "name": "metal",
                "title": None,
                "is_fieldset": True,
                "fields": ['microstructure',
                           'metal1',
                           'metalx']
            },
            {
                "name": "corrosion",
                "title": None,
                "is_fieldset": True,
                "fields": ['corrosion_form',
                           'corrosion_type']
            }
        )
        fields = sum([fs['fields'] for fs in fieldsets],[])
        widgets = get_updated_widgets({}, Artefact, fields)

    fieldsets = Meta.fieldsets

    # Non Artefact/form only fields (coming from related model Section )
    complementary_information = forms.CharField(widget=TinyMCE(), required=False)
    macroscopic_text = forms.CharField(widget=TinyMCE(), required=False)
    sample_complementary_information = forms.CharField(widget=TinyMCE(), required=False)
    analyses_performed = forms.CharField(widget=TinyMCE(), required=False)
    metal_text = forms.CharField(widget=TinyMCE(), required=False)
    metal_complementary_information = forms.CharField(widget=TinyMCE(), required=False)
    corrosion_text = forms.CharField(widget=TinyMCE(), required=False)
    corrosion_complementary_information = forms.CharField(widget=TinyMCE(),required=False)
    synthesis_text = forms.CharField(widget=TinyMCE(), required=False)
    conclusion_text = forms.CharField(widget=TinyMCE(), required=False)
    references_text = forms.CharField(widget=TinyMCE(), required=False)

class ArtefactsCreateForm(forms.ModelForm):
    """
    Create a new artefact
    """

    class Meta:
        model = Artefact
        exclude = []
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

class StratigraphyCreateForm(forms.ModelForm):

    class Meta:
        model = Stratigraphy
        fields = ['order', 'legend']

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
    city = forms.ModelChoiceField(required=False,
                                  help_text=unicode(Origin._meta.get_field('city').help_text),
        queryset=City.objects.all(),
        widget=autocomplete.ModelSelect2(url='artefacts:city-autocomplete')
    )

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
        fields = ['name']


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


class ContactAuthorForm(forms.Form):
    subject = forms.CharField(label='Subject')
    message = forms.CharField(label='Your message', widget=forms.Textarea)
    sender = forms.EmailField(label='Your email')
    cc_myself = forms.BooleanField(label='Send a copy to myself', required=False)


class ShareArtefactForm(forms.Form):
    recipient = forms.EmailField(label='Share with (email)')
    right = forms.ChoiceField(choices=Token.RIGHT_CHOICES)
    comment = forms.CharField(label='Personal comment', required=False)
    cc_myself = forms.BooleanField(label='Send a copy to myself', required=False)


class ShareWithFriendForm(forms.Form):
    recipient = forms.EmailField(label='Share with (email)')
    message = forms.CharField(label='Your message', required=False)

class ObjectCreateForm(forms.ModelForm) :

    class Meta:
        model = Object
        exclude = ['user']

class ObjectUpdateForm(forms.ModelForm) :

    class Meta:
        model = Object
        exclude = ['user']

class CollaborationCommentForm(forms.ModelForm):
    comment = forms.CharField(widget = TinyMCE(attrs={'cols': 10, 'rows': 10}), required = False)

    class Meta:
        model = Collaboration_comment
        fields = ['comment']

class TokenHideForm(forms.ModelForm):

    comment = forms.CharField(widget = TinyMCE(attrs={'cols': 10, 'rows': 10}), required = False)

    class Meta:
        model = Token
        fields=['comment']

class PublicationDecisionForm(forms.ModelForm):

    comment_to_user = forms.CharField(widget = TinyMCE(attrs={'cols': 10, 'rows': 5}), required = False)

    class Meta:
        model = Publication
        fields=['comment_to_user']

class PublicationDelegateForm(forms.ModelForm):
    # admin = None
    # # Get delegated administrator group to display only delegated administrator users
    # users = User.objects.all()
    # for user in users :
    #     groups = user.groups.all()
    #     for group in groups :
    #         if group.name=='Delegated administrator' :
    #             admin = group

    delegated_user = forms.ModelChoiceField(User.objects.filter(groups__name='Delegated administrator').order_by('username'), help_text='The delegated admin charged to analyze the request.', required=True)
    comment_delegation = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 5}), required=False)

    class Meta:
        model = Publication
        fields=['delegated_user', 'comment_delegation']

class PublicationRejectDecisionForm(forms.ModelForm):
    comment_delegation = forms.CharField(widget=TinyMCE(attrs={'cols': 10, 'rows': 5}), required=True)

    class Meta:
        model = Publication
        fields=['comment_delegation']
