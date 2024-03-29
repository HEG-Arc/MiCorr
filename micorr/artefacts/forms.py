from django import forms
from django.db.models import QuerySet
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.forms import TextInput
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from django.utils.functional import lazy
from django.db import connection

from users.models import User

from .models import Artefact, Document, CorrosionForm, CorrosionType, Environment, Object, Origin, \
    Alloy, Technology, Microstructure, RecoveringDate, Image, Type, Stratigraphy, Token, Collaboration_comment, \
    Publication, ArtefactFormDescription, Element
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


class ModelSelect2WithPop(autocomplete.ModelSelect2):
    def render(self, name, *args, **kwargs):
        # forms/widgets Widget.render() renderer arg (new for django 1.11) is unsupported by
        # dal/widgets.py:WidgetMixin implementation so we remove it. it's default value will be used
        kwargs.pop('renderer',None)
        html = super(ModelSelect2WithPop, self).render(name, *args, **kwargs)
        popupplus = render_to_string("form/popupplus.html", {'field': name})
        return html + popupplus

class ModelSelect2MultipleWithPop(autocomplete.ModelSelect2Multiple):
    def render(self, name, *args, **kwargs):
        # forms/widgets Widget.render() renderer arg (new for django 1.11) is unsupported by
        # dal/widgets.py:WidgetMixin implementation so we remove it. it's default value will be used
        kwargs.pop('renderer', None)
        html = super(ModelSelect2MultipleWithPop, self).render(name, *args, **kwargs)
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
            'Element': 'artefacts:element-autocomplete',
            'Contact':'artefacts:contact-autocomplete',
            'Origin':'artefacts:origin-autocomplete'
        }
        return m2u.get(model_name, 'artefacts:generic-autocomplete')
    for f_name in fields:
        for meta_field in model_class._meta.get_fields():
            if f_name == meta_field.name and meta_field.db_type.__self__.__class__ in (ForeignKey, ManyToManyField):
                rel_model_name = meta_field.related_model.__name__
                if meta_field.db_type.__self__.__class__ == ForeignKey:
                    widget_class = ModelSelect2WithPop if rel_model_name in (
                        'Origin', 'Contact') else autocomplete.ModelSelect2
                else:
                    widget_class = ModelSelect2MultipleWithPop if rel_model_name in (
                        'Origin', 'Contact') else autocomplete.ModelSelect2Multiple
                widgets[f_name] = widget_class(url=reverse_lazy(get_url_name(rel_model_name), args=[rel_model_name]),
                                               attrs={'data-html ': True} if rel_model_name=='Element' else {})

    return widgets

# lazily retrieve field meta data from ArtefactFormDescription at module load time
# to avoid accessing ArtefactFormDescription model during django init creating dependency issues on manage.py migration for ex.
# as this is used for help_texts and labels ArtefactForm.Meta class variables definition

ARTEFACT_FORM_DESCRIPTIONS = lazy(
    lambda: ArtefactFormDescription.objects.filter(form='ArtefactForm').values('field', 'name',
                                                                               'text','instructions') if 'artefacts_formdescription' in connection.introspection.table_names() else ArtefactFormDescription.objects.none(),
    QuerySet)()

class ArtefactForm(FieldsetForm):

    class Meta:
        model = Artefact
        fieldsets = (
            {
                "name": "authors",
                "title": None,
                "is_fieldset": True,
                "fields": [
                    'name',
                    'author'
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
                    'chronology_category',  # fk
                    'chronology_tpq',
                    'chronology_taq',
                    'chronology_comment',
                    'environment',  # fk
                    'location',  # fk
                    'owner',  # fk
                    'inventory_number',
                    'recorded_conservation_data',
                ]
            },
            {
                "name": "sample",
                "title": "optional fields",
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
                           'metal_e_1',
                           'metal_e_x']
            },
            {
                "name": "corrosion",
                "title": None,
                "is_fieldset": True,
                "fields": ['corrosion_form',
                           'corrosion_type']
            }
        )
        fields = sum([fs['fields'] for fs in fieldsets], [])
        widgets = get_updated_widgets({}, Artefact, fields)

        # override default model help_texts and labels (defined in Artefact)
        # with values from ArtefactFormDescription wagtail snippet model
        help_texts = lazy(lambda: {r['field']: r['text'] for r in ARTEFACT_FORM_DESCRIPTIONS}, dict)()
        labels = lazy(lambda: {r['field']: r['name'] for r in ARTEFACT_FORM_DESCRIPTIONS}, dict) ()
        instructions = lazy(lambda: {r['field']: r['instructions'] for r in ARTEFACT_FORM_DESCRIPTIONS}, dict) ()

    # we add a name is a form's own field (not inherited from Artefact model) as we use it
    # to update related Object instance name field
    name = forms.CharField(label='Artefact name', max_length=100)
    name.widget.attrs.update({'class': 'default_text_border'})

    @classmethod
    def update_fields(cls):
        """
        Dynamic form fields update from db:
        Updates Class base_fields meta data from database. which will be use for subsequent Form instance creation
        called by ArtefactFormDescription.save when updating field description from wagtail admin for ex.
        (no need to update Meta.help_texts and Meta.labels as they are only used at class initialisation to build cls.base_fields)
        :return: None
        """
        for r in ARTEFACT_FORM_DESCRIPTIONS:
            if r['field'] in cls.base_fields:
                cls.base_fields[r['field']].label = r['name']
                cls.base_fields[r['field']].help_text = r['text']

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

class ArtefactCreateForm(forms.ModelForm):
    """
    Create a new artefact
    """

    class Meta:
        model = Artefact
        exclude = []
        widgets = {
            'type': TextInput(),
            'recovering_date': TextInput(),
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
                                  help_text=str(Origin._meta.get_field('city').help_text),
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
    metal_e_1 = django_filters.ModelChoiceFilter(label='Metal Family', queryset=Element.objects.filter(
        id__in=Artefact.objects.values_list("metal_e_1").distinct()), empty_label='All Metal Families')
    corrosion_form = django_filters.ModelChoiceFilter(label='Corrosion Forms', queryset=CorrosionForm.objects.filter(
        id__in=Artefact.objects.values_list("corrosion_form")), empty_label='All Corrosion Forms')
    environment = django_filters.ModelChoiceFilter(label='Environment', queryset=Environment.objects.all(),
                                                   empty_label='All Environments')

    class Meta:
        model = Artefact
        fields = ['origin__city__country', 'metal_e_1', 'corrosion_form', 'environment']


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
