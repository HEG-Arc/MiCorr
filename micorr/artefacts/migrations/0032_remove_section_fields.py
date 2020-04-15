# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-23 21:25


from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0031_datamigration_update_sections'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='section',
            options={'ordering': ['template__order'], 'verbose_name': 'Section', 'verbose_name_plural': 'Sections'},
        ),
        migrations.RemoveField(
            model_name='section',
            name='order',
        ),
        migrations.RemoveField(
            model_name='section',
            name='section_category',
        ),
        migrations.RemoveField(
            model_name='section',
            name='title',
        ),
    ]
