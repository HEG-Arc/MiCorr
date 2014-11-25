from haystack import indexes
from .models import Artefact


class ArtefactIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    metal = indexes.CharField(model_attr='metal')

    def get_model(self):
        return Artefact

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()