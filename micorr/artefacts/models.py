# coding=utf-8
from datetime import datetime
from django.db import models
from django.conf import settings
from django_extensions.db.models import TimeStampedModel
# from contacts.models import Contact
from cities_light.models import City


class Metal(TimeStampedModel):
    """
    With a primary and a secondary element
    Can be composed of another Metal object
    """
    primary_element = models.CharField(max_length=2, blank=True)
    secondary_element = models.CharField(max_length=2, blank=True)
    description = models.CharField(max_length=100, blank=True)
    parent_metal = models.ForeignKey('self', blank=True, null=True)

    def __unicode__(self):
        return "%s / %s --> %s" % (self.primary_element, self.secondary_element, self.description)


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
        return " ".join(origin)

    def __unicode__(self):
        return self.origin_verbose_description()


class ChronologyCategory(TimeStampedModel):
    """
    The dating of the artefat
    """
    name = models.CharField(max_length=100, blank=True, help_text='The dating of the artefact')

    def __unicode__(self):
        return self.name


class ChronologyPeriod(TimeStampedModel):
    """
    A more precise dating of the artefact
    """
    chronologycategory = models.ForeignKey(ChronologyCategory, blank=True, null=True,
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
    How the artefact was conserved
    """
    name = models.CharField(max_length=100, blank=True, help_text='How the artefact was conserved')

    def __unicode__(self):
        return self.name


class MicrostructureType(TimeStampedModel):
    """
    What the artefact is made of
    """
    type = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.type


class Microstructure(TimeStampedModel):
    """
    For a single microstructure type, many different microstructures are available
    An artefact can be made of several microstructures
    """
    microstructuretype = models.ForeignKey(MicrostructureType, blank=True, null=True)
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
    inventory_number = models.CharField(max_length=100, blank=True, help_text='The reference number of the artefact')
    description = models.TextField(blank=True,
                                   help_text='A short description of the artefact. Can also include its dimensions')
    initial_pub_date = models.DateTimeField('date published', blank=True, null=True, default=datetime.now,
                                            help_text='The date and time when the artefact was first entered into the database')
    additional_information = models.TextField(blank=True, help_text='A field to add more information')

    # Foreign Keys
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", blank=True, null=True,
                             help_text='The user who entered the artefact into the database')
    metal = models.ForeignKey(Metal, verbose_name='metal type', blank=True, null=True)
    type = models.ForeignKey(Type, verbose_name='object type', blank=True, null=True,
                             help_text='The artefact usage')
    origin = models.ForeignKey(Origin, blank=True, null=True,
                               help_text='The place and city where the artefact comes from')
    chronology_period = models.ForeignKey(ChronologyPeriod, blank=True, null=True,
                                          help_text='The approximate dating of the artefact')
    environment = models.ManyToManyField(Environment, blank=True, null=True,
                                         help_text='The environment where the artefact was buried. Can be multiple')
    #owner = models.ForeignKey(Contact, blank=True, null=True)
    technology = models.ForeignKey(Technology, verbose_name='technology used', blank=True, null=True,
                                   help_text='The technology used to')
    microstructure = models.ForeignKey(Microstructure, blank=True, null=True)
    corrosion = models.ForeignKey(Corrosion, blank=True, null=True)

    class Meta:
        ordering = ['-initial_pub_date']

    def get_environments(self):
        environments_list = []
        for env in self.environment.all():
            environments_list.append(env)
        return environments_list

    def artefact_verbose_description(self):
        if self.origin:
            origin_text = self.origin.origin_verbose_description()
        artefact = []
        if self.metal:
            if self.metal.description:
                artefact.append(self.metal.description)
        if self.origin:
            artefact.append(self.origin.city.country.name)
            artefact.append(origin_text)
        if self.chronology_period:
            artefact.append(self.chronology_period.chronologycategory.name)
        return " - ".join(artefact)

    def __unicode__(self):
        return self.artefact_verbose_description()


class Section(TimeStampedModel):
    """
    An artefact may have many sections with images inside
    """
    artefact = models.ForeignKey(Artefact, blank=True, null=True, help_text='The corresponding artefact')
    title = models.CharField(max_length=100, blank=True, help_text='The section title')
    description = models.TextField(blank=True, help_text='The description of the section')
    order = models.IntegerField(blank=True, null=True, help_text='The section order for a given artefact')

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return "%s, %s" % (self.artefact.inventory_number, self.order)


class Image(TimeStampedModel):
    """
    An image refers to a section
    """
    section = models.ForeignKey(Section, blank=True, null=True, help_text='The corresponding section')
    image = models.ImageField(blank=True, null=True, help_text='The image file')
    legend = models.TextField(blank=True, help_text='The legend for a given image')

    def __unicode__(self):
        return self.legend