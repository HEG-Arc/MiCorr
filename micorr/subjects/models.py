from django.db import models
from users.models import User


# For each object stored in the database
class Subject(models.Model):
    user = models.ForeignKey(User, verbose_name="user's object")
    metal = models.CharField("metal type", max_length=100, blank=True)
    name = models.CharField("object name", max_length=100, blank=True)
    origin = models.CharField(max_length=100, blank=True)
    chronology = models.CharField(max_length=100, blank=True)
    environment = models.CharField(max_length=100, blank=True)
    owner = models.CharField(max_length=100, blank=True)
    technology = models.CharField(max_length=100, blank=True)
    microstructure = models.CharField(max_length=100, blank=True)
    corrosion_form = models.CharField(max_length=100, blank=True)
    corrosion_type = models.CharField(max_length=100, blank=True)
    image = models.ImageField(blank=True)
    pub_date = models.DateTimeField('date published')

    def __unicode__(self):
        return self.name