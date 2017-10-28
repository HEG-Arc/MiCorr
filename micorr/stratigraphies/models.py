from django.db import models
from django.utils.encoding import python_2_unicode_compatible

from wagtail.wagtailsnippets.models import register_snippet
from wagtail.wagtailadmin.edit_handlers import FieldPanel


@python_2_unicode_compatible  # provide equivalent __unicode__ and __str__ methods on Python 2
class NodeDescription(models.Model):
    label = models.CharField(max_length=80, null=True, blank=True)
    uid = models.CharField(max_length=80, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    text = models.TextField()
    panels = [
        FieldPanel('uid'),
        FieldPanel('name'),
        FieldPanel('text'),
    ]

    def __str__(self):
        return self.name
        #return '{}: {}'.format(self.label, self.name)

class FamilyGroupManager(models.Manager):
    def get_queryset(self):
        return super(FamilyGroupManager,self).get_queryset().filter(label='FamilyGroup')

@register_snippet
class FamilyGroupDescription(NodeDescription):
    def __init__(self, *args, **kwargs):
        self._meta.get_field('label').default = "FamilyGroup"
        super(FamilyGroupDescription, self).__init__(*args, **kwargs)
    objects = FamilyGroupManager()

    class Meta:
        proxy = True

class FamilyManager(models.Manager):
    def get_queryset(self):
        return super(FamilyManager,self).get_queryset().filter(label='Family')

@register_snippet
class FamilyDescription(NodeDescription):
    def __init__(self, *args, **kwargs):
        self._meta.get_field('label').default = "Family"
        super(FamilyDescription, self).__init__(*args, **kwargs)

    objects = FamilyManager()

    class Meta:
        proxy = True
