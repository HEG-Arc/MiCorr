# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2019-04-12 20:04


import artefacts.year_field
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0034_datamigration_artefactformdescription'),
    ]

    operations = [
        migrations.AddField(
            model_name='artefact',
            name='chronology_category',
            field=models.ForeignKey(blank=True, help_text='A general dating of the artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.ChronologyCategory'),
        ),
        migrations.AddField(
            model_name='artefact',
            name='chronology_comment',
            field=models.CharField(blank=True, default='', help_text='Dating of artefact comment', max_length=100),
        ),
        migrations.AddField(
            model_name='artefact',
            name='chronology_taq',
            field=artefacts.year_field.YearField(blank=True, default=0, help_text='Dating of artefact TAQ (Terminus ante quem) e.g. "200 A.D."'),
        ),
        migrations.AddField(
            model_name='artefact',
            name='chronology_tpq',
            field=artefacts.year_field.YearField(blank=True, default=0, help_text='Dating of artefact TPQ (Terminus post quem) e.g. "3000 B.C."'),
        ),
        migrations.AddField(
            model_name='chronologycategory',
            name='taq',
            field=artefacts.year_field.YearField(blank=True, default=0, help_text='Category TAQ (Terminus ante quem) e.g. "200 A.D."'),
        ),
        migrations.AddField(
            model_name='chronologycategory',
            name='tpq',
            field=artefacts.year_field.YearField(blank=True, default=0, help_text='Category TPQ (Terminus post quem) e.g. "3000 B.C."'),
        ),
    ]
