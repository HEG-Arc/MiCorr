from django import forms
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.forms import TextInput, Textarea
from django.template.loader import render_to_string

from contacts.models import Contact
from users.models import User

from .models import Artefact, Document, Metal, CorrosionForm, CorrosionType, Environment, Object, Origin, ChronologyPeriod, \
    Alloy, Technology, Microstructure, RecoveringDate, Image, Type, Stratigraphy, Token, Collaboration_comment, \
    Publication
from cities_light.models import Country, City
from dal import autocomplete
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
#
# class ArfactsUpdateObjectForm(forms.ModelForm):
#     class Meta:
#         model = Artefact

def get_updated_widgets(widgets, model_class, fields):
    for f_name in fields:
        # field = filter(lambda f: f.name == (lambda f_name : f_name), model_class._meta.get_fields())[0]
        for meta_field in model_class._meta.get_fields():
            if f_name == meta_field.name:
                if meta_field.db_type.im_class == ForeignKey:
                    widgets[f_name] = SelectWithPop
                elif meta_field.db_type.im_class == ManyToManyField:
                    widgets[f_name] = MultipleSelectWithPop
    return widgets

class ArfactsDescriptionForm(forms.ModelForm):

    class Meta:
        model = Artefact

        fields = [  # hand picked from existing description_section. template
            'description',
            'type', # fk
            'origin',# fk
            'recovering_date',# fk
            'chronology_period',# fk
            'environment',# fk
            'location',# fk
            'owner',# fk
            'inventory_number',
            'recorded_conservation_data',
        ]
        widgets = get_updated_widgets({}, Artefact, fields)
        widgets['chronology_period'] = autocomplete.ModelSelect2(url='artefacts:chronology-period-autocomplete')


        # f.db_type.im_class == ForeignKey
class ArfactsSampleForm(forms.ModelForm):

    class Meta:
        model = Artefact

        fields = [  # hand picked from existing description_section. template
            'description',
            'type', # fk
            'origin',# fk
            'recovering_date',# fk
            'chronology_period',# fk
            'environment',# fk
            'location',# fk
            'owner',# fk
            'inventory_number',
            'recorded_conservation_data',
        ]
        widgets = {}


class ArtefactsForm(forms.ModelForm):

    class Meta:
        model = Artefact
        fk_fields = [ # hand picked from [f.name for f in Artefact._meta.get_fields() if f.db_type.im_class==ForeignKey]
            'metal1',
            'alloy',
            'technology',
            'sample_location',
            'responsible_institution',
            'microstructure',
            'corrosion_form',
            'corrosion_type']
        m2m_fields = ['author', 'metalx']

        # Here we only customize widget of selected fk_fields and m2m_fields
        # whereas redefining fields in the Form for this purpose would override
        # all model attributes including help_text...
        widgets = {f: SelectWithPop for f in fk_fields}
        widgets.update({f: MultipleSelectWithPop for f in m2m_fields})
        widgets['author'] = autocomplete.ModelSelect2Multiple(url='artefacts:contact-autocomplete')

        other_fields = [  # hand picked from [f.name for f in Artefact._meta.get_fields()]
            'sample_description',
            'sample_number',
            'date_aim_sampling'
        ]
        fields = fk_fields + m2m_fields + other_fields

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
