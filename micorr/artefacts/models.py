# coding=utf-8
from django.db import models
from django.conf import settings
#from cities_light.models import City


class Metal(models.Model):
    primary_element = models.CharField(max_length=2, blank=True)
    secondary_element = models.CharField(max_length=2, blank=True)
    description = models.CharField(max_length=100, blank=True)
    parent_metal = models.ForeignKey('self', blank=True, null=True)

    def __str__(self):
        return "%s / %s --> %s" % (self.primary_element, self.secondary_element, self.description)


class Type(models.Model):
    name = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class Origin(models.Model):
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


class Chronology(models.Model):
    name = models.CharField(max_length=100, blank=True)
    period = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return "%s - %s" % (self.name, self.period)


class Environment(models.Model):
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class MicrostructureType(models.Model):
    type = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.type


class Microstructure(models.Model):
    microstructuretype = models.ForeignKey(MicrostructureType, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Corrosion(models.Model):
    form = models.CharField(max_length=100, blank=True)
    type = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return "%s - %s" % (self.form, self.type)


# For each artefact stored in the database
class Artefact(models.Model):
    inventory_number = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    initial_pub_date = models.DateTimeField('date published', blank=True, null=True)
    additional_information = models.TextField(blank=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", blank=True, null=True)
    metal = models.ForeignKey(Metal, verbose_name="metal type", blank=True, null=True)
    type = models.ForeignKey(Type, verbose_name="object type", blank=True, null=True)
    origin = models.ForeignKey(Origin, blank=True, null=True)
    chronology = models.ForeignKey(Chronology, blank=True, null=True)
    environment = models.ManyToManyField(Environment, blank=True, null=True)
    technology = models.ForeignKey(Technology, verbose_name="technology used", blank=True, null=True)
    microstructuretype = models.ForeignKey(MicrostructureType, verbose_name="microstructure type", blank=True, null=True)
    corrosion = models.ForeignKey(Corrosion, blank=True, null=True)
    #owner = models.CharField(max_length=100, blank=True)

    def get_environments(self):
        environments_list = []
        for env in self.environment.all():
            environments_list.append(env)
        return environments_list

    def __str__(self):
        artefact = []
        if self.metal.description:
            artefact.append(self.metal.description)
        if self.origin.country:
            artefact.append(self.origin.country)
        if self.origin.site:
            artefact.append(self.origin.site)
        if self.chronology.name:
            artefact.append(self.chronology.name)
        return " - ".join(artefact)


class Section(models.Model):
    artefact = models.ForeignKey(Artefact, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title


class Image(models.Model):
    section = models.ForeignKey(Section, blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    legend = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.legend