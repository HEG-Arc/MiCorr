# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2020-01-07 09:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0044_datamigration_extract_credit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chronologyperiod',
            name='chronology_category',
        ),
        migrations.RemoveField(
            model_name='artefact',
            name='chronology_period',
        ),
        migrations.DeleteModel(
            name='ChronologyPeriod',
        ),
    ]