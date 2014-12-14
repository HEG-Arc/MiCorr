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

    def __unicode__(self):
        return self.element


class Alloy(TimeStampedModel):
    """
    The artefact alloy
    """
    name = models.CharField(max_length=20, blank=True, help_text='The artefact alloy')

    def __unicode__(self):
        return self.name


class Type(TimeStampedModel):
    """
    What the artefact was used for
    """
    name = models.CharField(max_length=200, blank=True, help_text='What the artefact was used for')

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
        return ", ".join(origin)

    def __unicode__(self):
        return self.origin_verbose_description()


class RecoveringDate(TimeStampedModel):
    """
    The date when the artefact was found
    """
    date = models.CharField(max_length=100, blank=True, help_text='The date when the artefact was found')

    def __unicode__(self):
        return self.date


class ChronologyCategory(TimeStampedModel):
    """
    The dating of the artefact
    """
    name = models.CharField(max_length=100, blank=True, help_text='The dating of the artefact')

    def __unicode__(self):
        return self.name


class ChronologyPeriod(TimeStampedModel):
    """
    A more precise dating of the artefact
    Has a foreign key on the ChronologyCategory class
    """
    chronology_category = models.ForeignKey(ChronologyCategory, blank=True, null=True,
                                           help_text='A more precise dating of the artefact')
    name = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.name


class Environment(TimeStampedModel):
    """
    What the burial conditions of the artefact were
    An artefact may have several environments
    """
    name = models.CharField(max_length=100, blank=True, help_text='The burial conditions of the artefact')

    def __unicode__(self):
        return self.name


class Technology(TimeStampedModel):
    """
    The manufacturing techniques used
    """
    name = models.CharField(max_length=100, blank=True, help_text='The manufacturing techniques used')

    def __unicode__(self):
        return self.name


class Microstructure(TimeStampedModel):
    """
    What the artefact is made of
    """
    name = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.name


class Corrosion(TimeStampedModel):
    """
    The corrosion form and the corrosion type observed
    """
    form = models.CharField(max_length=100, blank=True)
    type = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        corrosion = []
        if self.form:
            corrosion.append(self.form)
        if self.type:
            corrosion.append(self.type)
        return " - ".join(corrosion)


class Artefact(TimeStampedModel):
    """
    An artefact has many foreign keys, corresponding to its caracteristics
    """
    # Own fields
    description = tinymce_models.HTMLField(blank=True, help_text='A short description of the artefact. Can also include its aspect (color), dimensions and weight')
    inventory_number = models.CharField(max_length=100, blank=True, default='', help_text='The serial number of the artefact')
    recorded_conservation_data = models.CharField(max_length=100, blank=True, default='')
    sample_description = tinymce_models.HTMLField(blank=True, default='', help_text='A field to add more information about the artefact')
    sample_number = models.CharField(max_length=100, blank=True, default='', help_text='The serial number of the artefact sample')
    date_aim_sampling = models.CharField(max_length=200, blank=True, default='', help_text='The date and aim of sampling')

    # Foreign Keys
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", blank=True, null=True,
                             help_text='The user who entered the artefact into the database')
    metal1 = models.ForeignKey(Metal, verbose_name='1st metal element', blank=True, null=True, related_name='1st metal element', help_text='The primary metal element of the artefact')
    metalx = models.ManyToManyField(Metal, verbose_name='other metal elements', blank=True, null=True, related_name='other metal elements', help_text='The other metal elements of the artefact')
    alloy = models.ForeignKey(Alloy, blank=True, null=True, help_text='The alloy the artefact is made of')
    type = models.ForeignKey(Type, verbose_name='object type', blank=True, null=True,
                             help_text='The artefact usage')
    origin = models.ForeignKey(Origin, blank=True, null=True, related_name='origin',
                               help_text='The place and city where the artefact comes from')
    recovering_date = models.ForeignKey(RecoveringDate, blank=True, null=True, help_text='The date of excavation')
    chronology_period = models.ForeignKey(ChronologyPeriod, blank=True, null=True,
                                          help_text='The approximate dating of the artefact')
    environment = models.ManyToManyField(Environment, blank=True, null=True,
                                         help_text='The environment where the artefact was buried. Can be multiple')
    location = models.ForeignKey(Contact, blank=True, null=True, related_name='artefact location', help_text='The actual location of the artefact')
    owner = models.ForeignKey(Contact, blank=True, null=True, related_name='artefact owner', help_text='The owner of the artefact')
    technology = models.ForeignKey(Technology, verbose_name='technology used', blank=True, null=True,
                                   help_text='The manufacturing techniques used')
    sample_location = models.ForeignKey(Contact, blank=True, null=True, related_name='sample location', help_text='The actual location of the artefact sample')
    responsible_institution = models.ForeignKey(Contact, blank=True, null=True, related_name='responsible institution', help_text='The responsible institution for the artefact sample')
    microstructure = models.ForeignKey(Microstructure, blank=True, null=True)
    corrosion = models.ForeignKey(Corrosion, blank=True, null=True)

    class Meta:
        ordering = ['-created']

    def get_environments(self):
        environments_list = []
        for env in self.environment.all():
            environments_list.append(env.name)
        return ", ".join(environments_list)

    def artefact_verbose_description(self):
        artefact = []
        if self.inventory_number:
            artefact.append(self.inventory_number)
        if self.alloy:
            artefact.append(self.alloy.name)
        if self.chronology_period:
            artefact.append(self.chronology_period.chronology_category.name)
        if self.origin:
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

    def __unicode__(self):
        return "%s, %s, %s" % (self.order, self.artefact, self.section_category)


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

    def __unicode__(self):
        return self.legend


def get_doc_storage_path(instance, filename):
    return '/'.join(['artefacts', str(instance.artefact.id), 'documents', filename])


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

    def __unicode__(self):
        return self.name