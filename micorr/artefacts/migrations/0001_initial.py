# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from micorr.artefacts import get_img_storage_path, get_img_storage_path_stratigraphy, get_doc_storage_path
from django.conf import settings
import django.utils.timezone
import tinymce.models
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Alloy',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('order', models.IntegerField(help_text=b'The purity of the metal. The lower, the purer the metal is', null=True, blank=True)),
                ('name', models.CharField(help_text=b'The artefact alloy', max_length=100, blank=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Alloy',
                'verbose_name_plural': 'Alloys',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Artefact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('description', tinymce.models.HTMLField(help_text=b'A short description of the artefact. Can also include its aspect (color), dimensions and weight', verbose_name=b'description of artefact', blank=True)),
                ('inventory_number', models.CharField(default=b'', help_text=b'The serial number of the artefact', max_length=100, verbose_name=b'inv. Number', blank=True)),
                ('recorded_conservation_data', models.CharField(default=b'', max_length=500, blank=True)),
                ('sample_description', tinymce.models.HTMLField(default=b'', help_text=b'A field to add more information about the artefact', verbose_name=b'description of sample', blank=True)),
                ('sample_number', models.CharField(default=b'', help_text=b'The serial number of the artefact sample', max_length=100, verbose_name=b'lab number of sample', blank=True)),
                ('date_aim_sampling', models.CharField(default=b'', help_text=b'The date and aim of sampling', max_length=200, verbose_name=b'date and aim of sampling', blank=True)),
                ('alloy', models.ForeignKey(blank=True, to='artefacts.Alloy', help_text=b'The alloy the artefact is made of', null=True)),
                ('author', models.ManyToManyField(related_name='the authors', to=b'contacts.Contact', blank=True, help_text=b'The author(s) of this artefact', null=True, verbose_name=b'authors')),
            ],
            options={
                'ordering': ['metal1', 'alloy', 'chronology_period__chronology_category', 'type'],
                'verbose_name': 'Artefact',
                'verbose_name_plural': 'Artefacts',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ChronologyCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('order', models.IntegerField(help_text=b'The category chronology', null=True, blank=True)),
                ('name', models.CharField(help_text=b'The dating of the artefact', max_length=100, blank=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Chronology Category',
                'verbose_name_plural': 'Chronology Categories',
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
                ('chronology_category', models.ForeignKey(blank=True, to='artefacts.ChronologyCategory', help_text=b'A general dating of the artefact', null=True)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Chronology Period',
                'verbose_name_plural': 'Chronology Periods',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CorrosionForm',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('form', models.CharField(max_length=100, blank=True)),
            ],
            options={
                'ordering': ['form'],
                'verbose_name': 'Corrosion Form',
                'verbose_name_plural': 'Corrosion Forms',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CorrosionType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('type', models.CharField(max_length=100, blank=True)),
            ],
            options={
                'ordering': ['type'],
                'verbose_name': 'Corrosion Type',
                'verbose_name_plural': 'Corrosion Types',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('document', models.FileField(help_text=b'The attached document', upload_to=get_doc_storage_path)),
                ('name', models.CharField(help_text=b'The document name', max_length=100, blank=True)),
                ('artefact', models.ForeignKey(blank=True, to='artefacts.Artefact', help_text=b'The corresponding artefact', null=True)),
            ],
            options={
                'verbose_name': 'Document',
                'verbose_name_plural': 'Documents',
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
                'ordering': ['name'],
                'verbose_name': 'Environment',
                'verbose_name_plural': 'Environments',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('image', models.ImageField(help_text=b'The image file', null=True, upload_to=get_img_storage_path, blank=True)),
                ('legend', models.CharField(help_text=b'The image description', max_length=500, blank=True)),
                ('order', models.IntegerField(help_text=b'The order of an image for a given section', null=True, blank=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Metal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('element', models.CharField(help_text=b'An element which is part of the artefact composition', max_length=2, blank=True)),
            ],
            options={
                'ordering': ['element'],
                'verbose_name': 'Metal',
                'verbose_name_plural': 'Metals',
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
                'ordering': ['name'],
                'verbose_name': 'Microstructure',
                'verbose_name_plural': 'Microstructures',
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
                'verbose_name': 'Origin',
                'verbose_name_plural': 'Origins',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='RecoveringDate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('date', models.CharField(help_text=b'The date when the artefact was found', max_length=200, blank=True)),
            ],
            options={
                'verbose_name': 'Recovering Date',
                'verbose_name_plural': 'Recovering Dates',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('title', models.CharField(default=b'', help_text=b'The section title', max_length=100, blank=True)),
                ('content', tinymce.models.HTMLField(help_text=b'The content of the section', blank=True)),
                ('order', models.IntegerField(help_text=b'The order of a section for a given artefact', null=True, blank=True)),
                ('complementary_information', tinymce.models.HTMLField(default=b'', help_text=b'Complementary information', blank=True)),
                ('artefact', models.ForeignKey(blank=True, to='artefacts.Artefact', help_text=b'The corresponding artefact', null=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Section',
                'verbose_name_plural': 'Sections',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SectionCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(max_length=2, choices=[(b'AR', b'Artefact'), (b'SA', b'Sample'), (b'AN', b'Analysis and Results'), (b'CO', b'Conclusion'), (b'RE', b'References')])),
                ('order', models.IntegerField(help_text=b'The order of a section category for a given artefact', null=True, blank=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Section Category',
                'verbose_name_plural': 'Section Categories',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Stratigraphy',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('order', models.IntegerField(help_text=b'The order of a stratigraphy for a given artefact', null=True, blank=True)),
                ('uid', models.CharField(help_text=b'The identification of the stratigraphy', max_length=500, null=True, blank=True)),
                ('url', models.CharField(help_text=b'The url that leads to the corresponding stratigraphy in the tool', max_length=500, null=True, blank=True)),
                ('image', models.ImageField(help_text=b'The image file for a stratigraphy', null=True, upload_to=get_img_storage_path_stratigraphy, blank=True)),
                ('artefact', models.ForeignKey(blank=True, to='artefacts.Artefact', help_text=b'The artefact the stratigraphy represents', null=True)),
            ],
            options={
                'ordering': ['artefact', 'order'],
                'verbose_name': 'Stratigraphy',
                'verbose_name_plural': 'Stratigraphies',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('name', models.CharField(help_text=b'The manufacturing techniques used', max_length=100, blank=True)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Technology',
                'verbose_name_plural': 'Technologies',
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
                'ordering': ['name'],
                'verbose_name': 'Type',
                'verbose_name_plural': 'Types',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='section',
            name='section_category',
            field=models.ForeignKey(blank=True, to='artefacts.SectionCategory', help_text=b'The corresponding section category', null=True),
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
            field=models.ForeignKey(blank=True, to='artefacts.ChronologyPeriod', help_text=b'The dating of the artefact', null=True, verbose_name=b'dating of artefact (Tpq _ Taq)'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='corrosion_form',
            field=models.ForeignKey(blank=True, to='artefacts.CorrosionForm', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='corrosion_type',
            field=models.ForeignKey(blank=True, to='artefacts.CorrosionType', help_text=b'', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='environment',
            field=models.ForeignKey(blank=True, to='artefacts.Environment', help_text=b'The environment where the artefact was found.', null=True, verbose_name=b'burial conditions / environment'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='location',
            field=models.ForeignKey(related_name='artefact location', blank=True, to='contacts.Contact', help_text=b'The actual location of the artefact', null=True, verbose_name=b'artefact location'),
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
            field=models.ManyToManyField(related_name='other metal elements', to=b'artefacts.Metal', blank=True, help_text=b'The other metal elements of the artefact.', null=True, verbose_name=b'other metal elements'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='microstructure',
            field=models.ForeignKey(blank=True, to='artefacts.Microstructure', help_text=b'Microstructure of the metal', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='origin',
            field=models.ForeignKey(related_name='origin', blank=True, to='artefacts.Origin', help_text=b'The place, city and country where the artefact comes from or the object to which the section considered belongs to', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='owner',
            field=models.ForeignKey(related_name='artefact owner', blank=True, to='contacts.Contact', help_text=b'The owner of the artefact', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='recovering_date',
            field=models.ForeignKey(blank=True, to='artefacts.RecoveringDate', help_text=b'The date of excavation for archaeological objects, of production and use for other artefacts', null=True, verbose_name=b'date of recovering'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='responsible_institution',
            field=models.ForeignKey(related_name='responsible institution', blank=True, to='contacts.Contact', help_text=b'The responsible institution for the artefact sample', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='sample_location',
            field=models.ForeignKey(related_name='sample location', blank=True, to='contacts.Contact', help_text=b'The actual location of the artefact sample', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='technology',
            field=models.ForeignKey(blank=True, to='artefacts.Technology', help_text=b'The manufacturing techniques used to produce the artefact', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='type',
            field=models.ForeignKey(blank=True, to='artefacts.Type', help_text=b'The name of the artefact, its typology', null=True, verbose_name=b'type of artefact'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='artefact',
            name='user',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, help_text=b'The user who entered the artefact into the database', null=True, verbose_name=b"user's object"),
            preserve_default=True,
        ),
        migrations.AlterModelOptions(
            name='alloy',
            options={'ordering': ['order', 'name'], 'verbose_name': 'Alloy', 'verbose_name_plural': 'Alloys'},
        ),
        migrations.AlterModelOptions(
            name='origin',
            options={'ordering': ['site'], 'verbose_name': 'Origin', 'verbose_name_plural': 'Origins'},
        ),
        migrations.AddField(
            model_name='artefact',
            name='name',
            field=models.CharField(default=b'', help_text=b'Name of the artefact', max_length=100, verbose_name=b'name', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='author',
            field=models.ManyToManyField(related_name='the authors', to=b'contacts.Contact', blank=True, help_text=b'The author(s) of this file is (are) responsible for the information provided. Author(s) should provide their last name, initial of their first name and in brackets the abbreviation of their institutional affiliation, such as Degrigny C. (HE-Arc CR).', null=True, verbose_name=b'authors'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='description',
            field=tinymce.models.HTMLField(help_text=b'A short description of the artefact. Can also include its general appearance (colour, presence or not of a corrosion layer, missing parts, large cracks, etc.)', verbose_name=b'description of artefact', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='inventory_number',
            field=models.CharField(default=b'', help_text=b'The inventory number of the artefact', max_length=100, verbose_name=b'inv. Number', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='recorded_conservation_data',
            field=models.CharField(default=b'', help_text=b'A brief description of the conservation treatment applied if any with literature references (Names of authors, year)', max_length=500, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='sample_description',
            field=tinymce.models.HTMLField(default=b'', help_text=b'Information on the sample, the way it was obtained, its condition (presence or not of corrosion layers) and dimensions', verbose_name=b'description of sample', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='sample_number',
            field=models.CharField(default=b'', help_text=b'The inventory number of the artefact sample', max_length=100, verbose_name=b'lab number of sample', blank=True),
            preserve_default=True,
        ),
    ]
