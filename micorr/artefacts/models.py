# coding=utf-8
from django.db import models
from django.conf import settings
from django_extensions.db.models import TimeStampedModel
#from contacts.models import Contact
#from cities_light.models import City


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
    name = models.CharField(max_length=200, blank=True)

    def __unicode__(self):
        return self.name


class Origin(TimeStampedModel):
    """
    Where the artefact was
    """
    site = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        origin = []
        if self.site:
            origin.append(self.site)
        if self.city:
            origin.append(self.city)
        if self.region:
            origin.append(self.region)
        return " ".join(origin)


class ChronologyCategory(TimeStampedModel):
    name = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.name


class ChronologyPeriod(TimeStampedModel):
    chronologycategory = models.ForeignKey(ChronologyCategory, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.name


class Environment(TimeStampedModel):
    """
    What the burial conditions of the artefact were
    An artefact may have several environments
    """
    name = models.CharField(max_length=100, blank=True)

    def __unicode__(self):
        return self.name


class Technology(TimeStampedModel):
    """
    How the artefact was conserved
    """
    name = models.CharField(max_length=100, blank=True)

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
    An artefact with has many foreign keys, corresponding to its caracteristics
    """
    # Own fields
    inventory_number = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    initial_pub_date = models.DateTimeField('date published', blank=True, null=True)
    additional_information = models.TextField(blank=True)

    # Foreign Keys
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", blank=True, null=True)
    metal = models.ForeignKey(Metal, verbose_name="metal type", blank=True, null=True)
    type = models.ForeignKey(Type, verbose_name="object type", blank=True, null=True)
    origin = models.ForeignKey(Origin, blank=True, null=True)
    chronology_period = models.ForeignKey(ChronologyPeriod, blank=True, null=True)
    environment = models.ManyToManyField(Environment, blank=True, null=True)
    #owner = models.ForeignKey(Contact, blank=True, null=True)
    technology = models.ForeignKey(Technology, verbose_name="technology used", blank=True, null=True)
    microstructure = models.ForeignKey(Microstructure, blank=True, null=True)
    corrosion = models.ForeignKey(Corrosion, blank=True, null=True)

    def get_environments(self):
        environments_list = []
        for env in self.environment.all():
            environments_list.append(env)
        return environments_list

    def __unicode__(self):
        origin = []
        if self.origin.site:
            origin.append(self.origin.site)
        if self.origin.city:
            origin.append(self.origin.city)
        if self.origin.region:
            origin.append(self.origin.region)
        origin_text = " ".join(origin)

        artefact = []
        if self.metal.description:
            artefact.append(self.metal.description)
        if self.origin.country:
            artefact.append(self.origin.country)
        if origin_text:
            artefact.append(origin_text)
        if self.chronology_period.chronologycategory.name:
            artefact.append(self.chronology_period.chronologycategory.name)
        return " - ".join(artefact)


class Section(TimeStampedModel):
    """
    An artefact may have many sections with images inside
    """
    artefact = models.ForeignKey(Artefact, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return "%s, %s" % (self.artefact.inventory_number, self.order)


class Image(TimeStampedModel):
    """
    An image refers to a section
    """
    section = models.ForeignKey(Section, blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    legend = models.TextField(blank=True)

    def __unicode__(self):
        return self.legend