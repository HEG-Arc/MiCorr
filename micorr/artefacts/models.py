# coding=utf-8
import os
from django.db import models
from contacts.models import Contact
from django.conf import settings
from django_extensions.db.models import TimeStampedModel
from tinymce import models as tinymce_models
from cities_light.models import City


class Metal(TimeStampedModel):
    """
    A metal is made of one element
    """
    element = models.CharField(max_length=2, blank=True, help_text='An element which is part of the artefact composition')

    class Meta:
        ordering = ['element']
        verbose_name = 'Metal'
        verbose_name_plural = 'Metals'

    def __unicode__(self):
        return self.element


class Alloy(TimeStampedModel):
    """
    The artefact alloy
    """
    order = models.IntegerField(blank=True, null=True, help_text='The purity of the metal. The lower, the purer the metal is')
    name = models.CharField(max_length=100, blank=True, help_text='The artefact alloy')

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Alloy'
        verbose_name_plural = 'Alloys'

    def __unicode__(self):
        return self.name


class Type(TimeStampedModel):
    """
    What the artefact was used for
    """
    name = models.CharField(max_length=200, blank=True, help_text='What the artefact was used for')

    class Meta:
        ordering = ['name']
        verbose_name = 'Type'
        verbose_name_plural = 'Types'

    def __unicode__(self):
        return self.name


class Origin(TimeStampedModel):
    """
    Where the artefact was located
    """
    site = models.CharField(max_length=100, blank=True, help_text='The place where the artefact was located')
    city = models.ForeignKey(City, blank=True, null=True, help_text='The city where the artefact was located')

    def origin_verbose_description(self):
        origin = []
        if self.site:
            origin.append(self.site)
        if self.city:
            origin.append(self.city.name)
            origin.append(self.city.region.name)
            origin.append(self.city.country.name)
        return ", ".join(origin)

    class Meta:
        ordering = ['site']
        verbose_name = 'Origin'
        verbose_name_plural = 'Origins'

    def __unicode__(self):
        return self.origin_verbose_description()


class RecoveringDate(TimeStampedModel):
    """
    The date when the artefact was found
    """
    date = models.CharField(max_length=200, blank=True, help_text='The date when the artefact was found')

    class Meta:
        verbose_name = 'Recovering Date'
        verbose_name_plural = 'Recovering Dates'

    def __unicode__(self):
        return self.date


class ChronologyCategory(TimeStampedModel):
    """
    The dating of the artefact
    """
    order = models.IntegerField(blank=True, null=True, help_text='The category chronology')
    name = models.CharField(max_length=100, blank=True, help_text='The dating of the artefact')

    class Meta:
        ordering = ['order']
        verbose_name = 'Chronology Category'
        verbose_name_plural = 'Chronology Categories'

    def __unicode__(self):
        return self.name


class ChronologyPeriod(TimeStampedModel):
    """
    A more precise dating of the artefact
    Has a foreign key on the ChronologyCategory class
    """
    chronology_category = models.ForeignKey(ChronologyCategory, blank=True, null=True,
                                            help_text='A general dating of the artefact')
    name = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Chronology Period'
        verbose_name_plural = 'Chronology Periods'

    def __unicode__(self):
        return self.name


class Environment(TimeStampedModel):
    """
    What the burial conditions of the artefact were
    """
    name = models.CharField(max_length=100, blank=True, help_text='The burial conditions of the artefact')

    class Meta:
        ordering = ['name']
        verbose_name = 'Environment'
        verbose_name_plural = 'Environments'

    def __unicode__(self):
        return self.name


class Technology(TimeStampedModel):
    """
    The manufacturing techniques used
    """
    name = models.CharField(max_length=100, blank=True, help_text='The manufacturing techniques used')

    class Meta:
        ordering = ['name']
        verbose_name = 'Technology'
        verbose_name_plural = 'Technologies'

    def __unicode__(self):
        return self.name


class Microstructure(TimeStampedModel):
    """
    What the artefact is made of
    """
    name = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Microstructure'
        verbose_name_plural = 'Microstructures'

    def __unicode__(self):
        return self.name


class CorrosionForm(TimeStampedModel):
    """
    The corrosion form observed
    """
    form = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['form']
        verbose_name = 'Corrosion Form'
        verbose_name_plural = 'Corrosion Forms'

    def __unicode__(self):
        return self.form


class CorrosionType(TimeStampedModel):
    """
    The corrosion type observed
    """
    type = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['type']
        verbose_name = 'Corrosion Type'
        verbose_name_plural = 'Corrosion Types'

    def __unicode__(self):
        return self.type


class Artefact(TimeStampedModel):
    """
    An artefact has many foreign keys, corresponding to its characteristics
    """
    # Own fields
    description = tinymce_models.HTMLField(verbose_name='description of artefact', blank=True, help_text='A short description of the artefact. Can also include its general appearance (colour, presence or not of a corrosion layer, missing parts, large cracks, etc.)')
    inventory_number = models.CharField(max_length=100, verbose_name='inv. Number', blank=True, default='', help_text='The inventory number of the artefact')
    recorded_conservation_data = models.CharField(max_length=500, blank=True, default='', help_text='A brief description of the conservation treatment applied if any with literature references (Names of authors, year)')
    sample_description = tinymce_models.HTMLField(verbose_name='description of sample', blank=True, default='', help_text='Information on the sample, the way it was obtained, its condition (presence or not of corrosion layers) and dimensions')
    sample_number = models.CharField(max_length=100, verbose_name='lab number of sample', blank=True, default='', help_text='The inventory number of the artefact sample')
    date_aim_sampling = models.CharField(max_length=200, verbose_name='date and aim of sampling', blank=True, default='', help_text='The date and aim of sampling')

    # Foreign Keys
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", blank=True, null=True,
                             help_text='The user who entered the artefact into the database')
    author = models.ManyToManyField(Contact, verbose_name='authors', blank=True, related_name='artefacts', help_text='The author(s) of this file is (are) responsible for the information provided. Author(s) should provide their last name, initial of their first name and in brackets the abbreviation of their institutional affiliation, such as Degrigny C. (HE-Arc CR).')
    metal1 = models.ForeignKey(Metal, verbose_name='1st metal element', blank=True, null=True, related_name='first_metal_artefacts', help_text='The primary metal element of the artefact')
    metalx = models.ManyToManyField(Metal, verbose_name='other metal elements', blank=True, related_name='other_metal_artefacts', help_text='The other metal elements of the artefact.')
    alloy = models.ForeignKey(Alloy, blank=True, null=True, help_text='The alloy the artefact is made of')
    type = models.ForeignKey(Type, verbose_name='type of artefact', blank=True, null=True,
                             help_text='The name of the artefact, its typology')
    origin = models.ForeignKey(Origin, blank=True, null=True, related_name='artefacts',
                               help_text='The place, city and country where the artefact comes from or the object to which the section considered belongs to')
    recovering_date = models.ForeignKey(RecoveringDate, verbose_name='date of recovering', blank=True, null=True, help_text='The date of excavation for archaeological objects, of production and use for other artefacts')
    chronology_period = models.ForeignKey(ChronologyPeriod, verbose_name='dating of artefact (Tpq _ Taq)', blank=True, null=True,
                                          help_text='The dating of the artefact')
    environment = models.ForeignKey(Environment, verbose_name='burial conditions / environment', blank=True, null=True,
                                         help_text='The environment where the artefact was found.')
    location = models.ForeignKey(Contact, verbose_name='artefact location', blank=True, null=True, related_name='artefacts_locations', help_text='The actual location of the artefact')
    owner = models.ForeignKey(Contact, blank=True, null=True, related_name='artefacts_owners', help_text='The owner of the artefact')
    technology = models.ForeignKey(Technology, blank=True, null=True,
                                   help_text='The manufacturing techniques used to produce the artefact')
    sample_location = models.ForeignKey(Contact, blank=True, null=True, related_name='sample_location', help_text='The actual location of the artefact sample')
    responsible_institution = models.ForeignKey(Contact, blank=True, null=True, related_name='responsible_institution', help_text='The responsible institution for the artefact sample')
    microstructure = models.ForeignKey(Microstructure, blank=True, null=True, help_text='A description of the metal: its composition, texture (porosity), hardness, microstructure revealed by etching and specific features (figures and tables are referred as Fig. 1, Table 1)')
    corrosion_form = models.ForeignKey(CorrosionForm, blank=True, null=True)
    corrosion_type = models.ForeignKey(CorrosionType, blank=True, null=True, help_text='A description of the corrosion layers: their composition, texture (porosity), microstructure if any and specific features (figures and tables are referred as Fig. 1, Table 1). The corrosion form(s) and corrosion type should be deduced')

    class Meta:
        verbose_name = 'Artefact'
        verbose_name_plural = 'Artefacts'
        ordering = ['metal1', 'alloy', 'chronology_period__chronology_category', 'type']

    def get_authors(self):
        authors_list = []
        for author in self.author.all():
            authors_list.append("{0}. {1} ({2}, {3})".format(author.name[0], author.surname,
                                                                  author.organization_name,
                                                                  author.city))
        return " & ".join(authors_list)

    def artefact_verbose_description(self):
        artefact = []
        if self.inventory_number:
            artefact.append(self.inventory_number)
        if self.alloy:
            artefact.append(self.alloy.name)
        if self.chronology_period:
            artefact.append(self.chronology_period.chronology_category.name)
        if self.origin:
            if self.origin.city:
                artefact.append(self.origin.city.country.name)
        return " - ".join(artefact)

    def artefact_verbose_description_short(self):
        artefact = []
        if self.alloy:
            artefact.append(self.alloy.name)
        if self.chronology_period:
            artefact.append(self.chronology_period.chronology_category.name)
        if self.origin:
            if self.origin.city:
                artefact.append(self.origin.city.country.name)
        return " - ".join(artefact)

    def __unicode__(self):
        return self.artefact_verbose_description()


class SectionCategory(TimeStampedModel):
    """
    A section belongs to a section category, which can be i.e. "Sample" or "References"
    """
    ARTEFACT = 'AR'
    SAMPLE = 'SA'
    ANALYSIS_AND_RESULTS = 'AN'
    CONCLUSION = 'CO'
    REFERENCES = 'RE'
    SECTION_CATEGORY_CHOICES = (
        (ARTEFACT, 'Artefact'),
        (SAMPLE, 'Sample'),
        (ANALYSIS_AND_RESULTS, 'Analysis and Results'),
        (CONCLUSION, 'Conclusion'),
        (REFERENCES, 'References'),
    )
    name = models.CharField(max_length=2, choices=SECTION_CATEGORY_CHOICES)
    order = models.IntegerField(blank=True, null=True, help_text='The order of a section category for a given artefact')

    class Meta:
        ordering = ['order']
        verbose_name = 'Section Category'
        verbose_name_plural = 'Section Categories'

    def __unicode__(self):
        return self.name


class Section(TimeStampedModel):
    """
    An artefact may have many sections with images inside
    """
    artefact = models.ForeignKey(Artefact, blank=True, null=True, help_text='The corresponding artefact')
    section_category = models.ForeignKey(SectionCategory, blank=True, null=True, help_text='The corresponding section category')
    title = models.CharField(max_length=100, blank=True, default='', help_text='The section title')
    content = tinymce_models.HTMLField(blank=True, help_text='The content of the section')
    order = models.IntegerField(blank=True, null=True, help_text='The order of a section for a given artefact')
    complementary_information = tinymce_models.HTMLField(blank=True, default='', help_text='Complementary information')

    class Meta:
        ordering = ['order']
        verbose_name = 'Section'
        verbose_name_plural = 'Sections'

    def __unicode__(self):
        return "%s, %s, %s" % (self.title, self.artefact, self.section_category)


def get_img_storage_path(instance, filename):
    return '/'.join(['artefacts', str(instance.section.artefact.id), 'images', filename])


class Image(TimeStampedModel):
    """
    An image refers to a section
    """
    section = models.ForeignKey(Section, blank=True, null=True, help_text='The corresponding section')
    image = models.ImageField(upload_to=get_img_storage_path, blank=True, null=True, help_text='The image file')
    legend = models.CharField(max_length=500, blank=True, help_text='The image description')
    order = models.IntegerField(blank=True, null=True, help_text='The order of an image for a given section')

    class Meta:
        ordering = ['order']
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __unicode__(self):
        return self.legend


def get_doc_storage_path(instance, filename):
    return '/'.join(['artefacts', str(instance.artefact.id), 'documents', filename])


def get_img_storage_path_stratigraphy(instance, filename):
    return '/'.join(['artefacts', str(instance.artefact.id), 'stratigraphies', filename])


class Stratigraphy(TimeStampedModel):
    """
    An artefact can be represented by one or more stratigraphies
    """
    artefact = models.ForeignKey(Artefact, blank=True, null=True, help_text='The artefact the stratigraphy represents')
    order = models.IntegerField(blank=True, null=True, help_text='The order of a stratigraphy for a given artefact')
    uid = models.CharField(max_length=500, blank=True, null=True, help_text='The identification of the stratigraphy')
    url = models.CharField(max_length=500, blank=True, null=True, help_text='The url that leads to the corresponding stratigraphy in the tool')
    image = models.ImageField(upload_to=get_img_storage_path_stratigraphy, blank=True, null=True, help_text='The image file for a stratigraphy')

    class Meta:
        ordering = ['artefact', 'order']
        verbose_name = 'Stratigraphy'
        verbose_name_plural = 'Stratigraphies'

    def __unicode__(self):
        return self.uid


class Document(TimeStampedModel):
    """
    A document (PDF, Word, ...) can be attached to an artefact to add information
    """
    artefact = models.ForeignKey(Artefact, blank=True, null=True, help_text='The corresponding artefact')
    document = models.FileField(upload_to=get_doc_storage_path, help_text='The attached document')
    name = models.CharField(max_length=100, blank=True, help_text='The document name')

    def extension(self):
        name, extension = os.path.splitext(self.document.name)
        if 'pdf' in extension:
            return 'pdf'
        if 'doc' in extension:
            return 'word'
        if 'xls' in extension:
            return 'excel'
        if 'ppt' in extension:
            return 'powerpoint'
        if ('zip' or 'rar') in extension:
            return 'archive'
        if ('jpg' or 'jpeg' or 'gif' or 'bmp' or 'png') in extension:
            return 'image'
        if 'txt' in extension:
            return 'text'
        return ''

    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'

    def __unicode__(self):
        return self.name
