# coding=utf-8
from django.db import models
from django.conf import settings
#from cities_light.models import City


class Metal(models.Model):
    primary_element = models.CharField(max_length=2)
    secondary_element = models.CharField(max_length=2, null=True)
    description = models.CharField(max_length=100)
    parent_metal = models.ForeignKey('self', null=True)


class Type(models.Model):
    name = models.CharField(max_length=200)


class Origin(models.Model):
    site = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    country = models.CharField(max_length=100)


class Chronology(models.Model):
    name = models.CharField(max_length=100)
    year = models.DateField()


class Environment(models.Model):
    name = models.CharField(max_length=100)


class Technology(models.Model):
    name = models.CharField(max_length=100)


class MicrostructureType(models.Model):
    type = models.CharField(max_length=100)


class Microstructure(models.Model):
    name = models.CharField(max_length=100)


class Corrosion(models.Model):
    type = models.CharField(max_length=100)
    form = models.CharField(max_length=100)


# For each artefact stored in the database
class Artefact(models.Model):
    inventory_number = models.IntegerField(null=True)
    description = models.TextField(null=True)
    pub_date = models.DateTimeField('date published', null=True)
    additional_information = models.TextField(null=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="user's object", null=True)
    metal = models.ForeignKey(Metal, verbose_name="metal type", null=True)
    type = models.ForeignKey(Type, verbose_name="object type", null=True)
    origin = models.ForeignKey(Origin, null=True)
    chronology = models.ForeignKey(Chronology, null=True)
    environment = models.ManyToManyField(Environment, null=True)
    technology = models.ForeignKey(Technology, verbose_name="technology used", null=True)
    microstructuretype = models.ForeignKey(MicrostructureType, null=True)
    microstructure = models.ForeignKey(Microstructure, null=True)
    corrosion = models.ForeignKey(Corrosion, null=True)
    #owner = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.type


class Section(models.Model):
    artefact = models.ForeignKey(Artefact, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()


class Image(models.Model):
    attached = models.ForeignKey(Section, null=True)
    image = models.ImageField()
    legend = models.CharField(max_length=100)