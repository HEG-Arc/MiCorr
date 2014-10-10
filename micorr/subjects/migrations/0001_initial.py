# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('metal', models.CharField(max_length=100, verbose_name=b'metal type', blank=True)),
                ('name', models.CharField(max_length=100, verbose_name=b'object name', blank=True)),
                ('origin', models.CharField(max_length=100, blank=True)),
                ('chronology', models.CharField(max_length=100, blank=True)),
                ('environment', models.CharField(max_length=100, blank=True)),
                ('owner', models.CharField(max_length=100, blank=True)),
                ('technology', models.CharField(max_length=100, blank=True)),
                ('microstructure', models.CharField(max_length=100, blank=True)),
                ('corrosion_form', models.CharField(max_length=100, blank=True)),
                ('corrosion_type', models.CharField(max_length=100, blank=True)),
                ('image', models.ImageField(upload_to=b'', blank=True)),
                ('pub_date', models.DateTimeField(verbose_name=b'date published')),
                ('user', models.ForeignKey(verbose_name=b"user's object", to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
