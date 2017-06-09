# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-05-11 17:00
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artefacts', '0003_auto_20170427_2316'),
    ]

    operations = [
        migrations.CreateModel(
            name='Object',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, default=b'', help_text=b'Name of the object', max_length=100, verbose_name=b'name')),
                ('user', models.ForeignKey(blank=True, help_text=b'The user who entered the object into the database', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name=b"user's object")),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Object',
                'verbose_name_plural': 'Objects',
            },
        ),
    ]
