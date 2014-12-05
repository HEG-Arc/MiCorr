# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import artefacts.models
import django.utils.timezone
from django.conf import settings
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cities_light', '0003_auto_20141202_2122'),
    ]

    operations = [
        migrations.CreateModel(
            name='Artefact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('inventory_number', models.CharField(help_text=b'The reference number of the artefact', max_length=100, blank=True)),
                ('description', models.TextField(help_text=b'A short description of the artefact. Can also include its dimensions', blank=True)),
                ('initial_pub_date', models.DateTimeField(default=datetime.datetime.now, help_text=b'The date and time when the artefact was first entered into the database', null=True, verbose_name=b'date published', blank=True)),
                ('additional_information', models.TextField(help_text=b'A field to add more information', blank=True)),
            ],
            options={
                'ordering': ['-initial_pub_date'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ChronologyCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(help_text=b'The dating of the artefact', max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ChronologyPeriod',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(max_length=100, blank=True)),
                ('chronology_category', models.ForeignKey(blank=True, to='artefacts.ChronologyCategory', help_text=b'A more precise dating of the artefact', null=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Corrosion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('form', models.CharField(max_length=100, blank=True)),
                ('type', models.CharField(max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('document', models.FileField(help_text=b'The attached document', upload_to=artefacts.models.get_doc_storage_path)),
                ('name', models.CharField(help_text=b'The document name', max_length=100, blank=True)),
                ('artefact', models.ForeignKey(blank=True, to='artefacts.Artefact', help_text=b'The corresponding artefact', null=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Environment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(help_text=b'The burial conditions of the artefact', max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('image', models.ImageField(help_text=b'The image file', null=True, upload_to=artefacts.models.get_img_storage_path, blank=True)),
                ('legend', models.TextField(help_text=b'The image description', blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Metal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('element', models.CharField(max_length=2, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Microstructure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MicrostructureType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('type', models.CharField(max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Origin',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('site', models.CharField(help_text=b'The place where the artefact was located', max_length=100, blank=True)),
                ('city', models.ForeignKey(blank=True, to='cities_light.City', help_text=b'The city where the artefact was located', null=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('title', models.CharField(help_text=b'The section title', max_length=100, blank=True)),
                ('description', models.TextField(help_text=b'The description of the section', blank=True)),
                ('order', models.IntegerField(help_text=b'The section order for a given artefact', null=True, blank=True)),
                ('artefact', models.ForeignKey(blank=True, to='artefacts.Artefact', help_text=b'The corresponding artefact', null=True)),
            ],
            options={
                'ordering': ['order'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(help_text=b'How the artefact was conserved', max_length=100, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(help_text=b'What the artefact was used for', max_length=200, blank=True)),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'abstract': False,
                'get_latest_by': 'modified',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='microstructure',
            name='microstructure_type',
            field=models.ForeignKey(blank=True, to='artefacts.MicrostructureType', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='image',
            name='section',
            field=models.ForeignKey(blank=True, to='artefacts.Section', help_text=b'The corresponding section', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='chronology_period',
            field=models.ForeignKey(blank=True, to='artefacts.ChronologyPeriod', help_text=b'The approximate dating of the artefact', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='corrosion',
            field=models.ForeignKey(blank=True, to='artefacts.Corrosion', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='environment',
            field=models.ManyToManyField(help_text=b'The environment where the artefact was buried. Can be multiple', to='artefacts.Environment', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='metal1',
            field=models.ForeignKey(related_name='1st metal element', blank=True, to='artefacts.Metal', help_text=b'The primary metal element of the artefact', null=True, verbose_name=b'1st metal element'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='metalx',
            field=models.ManyToManyField(related_name='other metal elements', to='artefacts.Metal', blank=True, help_text=b'The other metal elements of the artefact', null=True, verbose_name=b'other metal elements'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='microstructure',
            field=models.ForeignKey(blank=True, to='artefacts.Microstructure', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='origin',
            field=models.ForeignKey(blank=True, to='artefacts.Origin', help_text=b'The place and city where the artefact comes from', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='technology',
            field=models.ForeignKey(blank=True, to='artefacts.Technology', help_text=b'The technology used to', null=True, verbose_name=b'technology used'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='type',
            field=models.ForeignKey(blank=True, to='artefacts.Type', help_text=b'The artefact usage', null=True, verbose_name=b'object type'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='user',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, help_text=b'The user who entered the artefact into the database', null=True, verbose_name=b"user's object"),
            preserve_default=True,
        ),
    ]
