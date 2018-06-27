from django import forms
from django.urls import reverse_lazy

from .models import Contact
from cities_light.models import Country, City, Region
from dal import autocomplete


class ContactCreateForm(forms.ModelForm):
    """
    Create a new contact
    """
    # customize ModelChoiceField widgets to use dal autocomplete
    country = forms.ModelChoiceField(required=False,
                                  help_text=unicode(Contact._meta.get_field('country').help_text),
                                  queryset=Country.objects.all(),
                                  widget=autocomplete.ModelSelect2(url='artefacts:country-autocomplete')
                                  )
    region = forms.ModelChoiceField(required=False,
                                  help_text=unicode(Contact._meta.get_field('region').help_text),
                                  queryset=Region.objects.all(),
                                  widget=autocomplete.ModelSelect2(url='artefacts:region-autocomplete')
                                  )
    city = forms.ModelChoiceField(required=False,
                                  help_text=unicode(Contact._meta.get_field('city').help_text),
                                  queryset=City.objects.all(),
                                  widget=autocomplete.ModelSelect2(url='artefacts:city-autocomplete')
                                  )
    class Meta:
        model = Contact
        exclude = ['user', 'parent']
