# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-13 14:25


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0023_origin_fields_metadata_udpate'),
    ]

    operations = [
        migrations.AddField(
            model_name='stratigraphy',
            name='legend',
            field=models.CharField(blank=True, help_text='The stratigraphy description', max_length=500),
        ),
        migrations.AlterField(
            model_name='stratigraphy',
            name='uid',
            field=models.CharField(blank=True, help_text='The unique identifier of the stratigraphy', max_length=500, null=True),
        ),
    ]
