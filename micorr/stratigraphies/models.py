from django.db import models

from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import FieldPanel


class NodeDescription(models.Model):
    label = models.CharField(max_length=80)
    uid = models.CharField(max_length=80,unique=True)
    name = models.CharField(max_length=255)
    text = models.TextField()
    panels = [
        FieldPanel('uid'),
        FieldPanel('name'),
        FieldPanel('text'),
    ]

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
        #return '{}: {}'.format(self.label, self.name)

class FamilyGroupManager(models.Manager):
    def get_queryset(self):
        return super(FamilyGroupManager,self).get_queryset().filter(label='FamilyGroup')

@register_snippet
class FamilyGroupDescription(NodeDescription):
    def __init__(self, *args, **kwargs):
        self._meta.get_field('label').default = "StratigraphyFamilyGroup"
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
        self._meta.get_field('label').default = "StratigraphyFamily"
        super(FamilyDescription, self).__init__(*args, **kwargs)

    objects = FamilyManager()

    class Meta:
        proxy = True
