# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2020-01-13 14:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0045_delete_chronologyperiod'),
    ]

    operations = [
        migrations.AddField(
            model_name='collaboration_comment',
            name='field_name',
            field=models.CharField(blank=True, max_length=80, null=True),
        ),
        migrations.AddField(
            model_name='collaboration_comment',
            name='fieldset_name',
            field=models.CharField(blank=True, max_length=80, null=True),
        ),
    ]
