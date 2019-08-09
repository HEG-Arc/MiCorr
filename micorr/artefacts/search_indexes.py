from haystack import indexes
from .models import Artefact, Section


class ArtefactIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    # Only add extra fields to the index if we use them
    # to filter result with SearchQuerySet
    # e.g if we want to replace ArtefactFilter and use haystack only

    # country = indexes.CharField(model_attr='origin__city__country__name')
    # metal_e_1 = indexes.CharField(model_attr='metal_e_1')
    # corrosion_form = indexes.CharField(model_attr='corrosion_form__form')
    # environment = indexes.CharField(model_attr='environment')


    def get_model(self):
        return Artefact

    def index_queryset(self, using=None):
        """
        Used when the entire index for model is updated.
        """
        return self.get_model().objects.filter(published=True)
