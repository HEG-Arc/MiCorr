from django import forms
from .models import Artefact, Document
from haystack.forms import SearchForm


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


class ArtefactSearchForm(SearchForm):

    def search(self):
        # First, store the SearchQuerySet received from other processing.
        sqs = super(ArtefactSearchForm, self).search()

        if not self.is_valid():
            return self.no_query_found()

        return sqs