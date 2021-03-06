# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-10-05 12:10


from django.db import migrations
import logging

logger = logging.getLogger('django.server')

# Irreversible Data migration to remove origin suffixes that were manually added to Object
# since we display origin information
# as of commit e1eeb88b445985f8f5caa97c7282fea6f859d0e3
# CAUTION this would destroy any existing name content after a first _

def remove_objects_origin_suffix(apps, schema_editor):
    Object = apps.get_model('artefacts', 'Object')
    print()
    for o in Object.objects.filter(name__contains='_'):
        name_parts=o.name.split('_')
        if len(name_parts)>1:
            logger.warning('renaming Object #%d  "%s" -> "%s"',o.pk, o.name, name_parts[0])
            o.name=name_parts[0]
            o.save()

class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0021_timestampedmodel_dj_extension_update'),
    ]

    operations = [
        # Here we add a fake reverse_code to avoid breaking reverse migration chain for compatible data update
        migrations.RunPython(remove_objects_origin_suffix, lambda app, schema_editor : None)
    ]
