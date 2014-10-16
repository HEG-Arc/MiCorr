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
            name='Artefact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('inventory_number', models.IntegerField(null=True)),
                ('description', models.TextField(null=True)),
                ('pub_date', models.DateTimeField(null=True, verbose_name=b'date published')),
                ('additional_information', models.TextField(null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Chronology',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('year', models.DateField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Corrosion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=100)),
                ('form', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Environment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Metal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('primary_element', models.CharField(max_length=2)),
                ('secondary_element', models.CharField(max_length=2, null=True)),
                ('description', models.CharField(max_length=100)),
                ('parent_metal', models.ForeignKey(to='artefacts.Metal', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Microstructure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MicrostructureType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Origin',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('site', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('region', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='artefact',
            name='chronology',
            field=models.ForeignKey(to='artefacts.Chronology', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='corrosion',
            field=models.ForeignKey(to='artefacts.Corrosion', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='environment',
            field=models.ManyToManyField(to='artefacts.Environment', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='metal',
            field=models.ForeignKey(verbose_name=b'metal type', to='artefacts.Metal', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='microstructure',
            field=models.ForeignKey(to='artefacts.Microstructure', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='microstructuretype',
            field=models.ForeignKey(to='artefacts.MicrostructureType', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='origin',
            field=models.ForeignKey(to='artefacts.Origin', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='technology',
            field=models.ForeignKey(verbose_name=b'technology used', to='artefacts.Technology', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='type',
            field=models.ForeignKey(verbose_name=b'object type', to='artefacts.Type', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='user',
            field=models.ForeignKey(verbose_name=b"user's object", to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
    ]
