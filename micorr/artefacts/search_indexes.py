from haystack import indexes
from .models import Artefact, Section


class ArtefactIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    # Own fields
    description = indexes.CharField(model_attr='description')
    inventory_number = indexes.CharField(model_attr='inventory_number')
    recorded_conservation_data = indexes.CharField(model_attr='recorded_conservation_data')
    sample_description = indexes.CharField(model_attr='sample_description')
    sample_number = indexes.CharField(model_attr='sample_number')
    date_aim_sampling = indexes.CharField(model_attr='date_aim_sampling')

    # Foreign Keys
    metal1 = indexes.CharField(model_attr='metal1')
    metalx = indexes.CharField(model_attr='metalx')
    alloy = indexes.CharField(model_attr='alloy')
    type = indexes.CharField(model_attr='type')
    origin = indexes.CharField(model_attr='origin')
    recovering_date = indexes.CharField(model_attr='recovering_date')
    chronology_period = indexes.CharField(model_attr='chronology_period')
    environment = indexes.CharField(model_attr='environment')
    location = indexes.CharField(model_attr='location')
    owner = indexes.CharField(model_attr='owner')
    technology = indexes.CharField(model_attr='technology')
    sample_location = indexes.CharField(model_attr='sample_location')
    responsible_institution = indexes.CharField(model_attr='responsible_institution')
    microstructure = indexes.CharField(model_attr='microstructure')
    corrosion_form = indexes.CharField(model_attr='corrosion_form')
    corrosion_type = indexes.CharField(model_attr='corrosion_type')

    def get_model(self):
        return Artefact

    def index_queryset(self, using=None):
        """
        Used when the entire index for model is updated.
        """
        return self.get_model().objects.all()


class SectionIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    artefact = indexes.CharField(model_attr='artefact')
    title = indexes.CharField(model_attr='title')
    content = indexes.CharField(model_attr='content')
    complementary_information = indexes.CharField(model_attr='complementary_information')

    def get_model(self):
        return Section

    def index_queryset(self, using=None):
        """
        Used when the entire index for model is updated.
        """
        return self.get_model().objects.all()