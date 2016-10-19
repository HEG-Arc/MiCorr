# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-19 14:15
from __future__ import unicode_literals

import artefacts.models
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import tinymce.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cities_light', '0006_compensate_for_0003_bytestring_bug'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alloy',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('order', models.IntegerField(blank=True, help_text=b'The purity of the metal. The lower, the purer the metal is', null=True)),
                ('name', models.CharField(blank=True, help_text=b'The artefact alloy', max_length=100)),
            ],
            options={
                'ordering': ['order', 'name'],
                'verbose_name': 'Alloy',
                'verbose_name_plural': 'Alloys',
            },
        ),
        migrations.CreateModel(
            name='Artefact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, default=b'', help_text=b'Name of the artefact', max_length=100, verbose_name=b'name')),
                ('description', tinymce.models.HTMLField(blank=True, help_text=b'A short description of the artefact. Can also include its general appearance (colour, presence or not of a corrosion layer, missing parts, large cracks, etc.)', verbose_name=b'description of artefact')),
                ('inventory_number', models.CharField(blank=True, default=b'', help_text=b'The inventory number of the artefact', max_length=100, verbose_name=b'inv. Number')),
                ('recorded_conservation_data', models.CharField(blank=True, default=b'', help_text=b'A brief description of the conservation treatment applied if any with literature references (Names of authors, year)', max_length=500)),
                ('sample_description', tinymce.models.HTMLField(blank=True, default=b'', help_text=b'Information on the sample, the way it was obtained, its condition (presence or not of corrosion layers) and dimensions', verbose_name=b'description of sample')),
                ('sample_number', models.CharField(blank=True, default=b'', help_text=b'The inventory number of the artefact sample', max_length=100, verbose_name=b'lab number of sample')),
                ('date_aim_sampling', models.CharField(blank=True, default=b'', help_text=b'The date and aim of sampling', max_length=200, verbose_name=b'date and aim of sampling')),
                ('alloy', models.ForeignKey(blank=True, help_text=b'The alloy the artefact is made of', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Alloy')),
            ],
            options={
                'ordering': ['metal1', 'alloy', 'chronology_period__chronology_category', 'type'],
                'verbose_name': 'Artefact',
                'verbose_name_plural': 'Artefacts',
            },
        ),
        migrations.CreateModel(
            name='ChronologyCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('order', models.IntegerField(blank=True, help_text=b'The category chronology', null=True)),
                ('name', models.CharField(blank=True, help_text=b'The dating of the artefact', max_length=100)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Chronology Category',
                'verbose_name_plural': 'Chronology Categories',
            },
        ),
        migrations.CreateModel(
            name='ChronologyPeriod',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, max_length=100)),
                ('chronology_category', models.ForeignKey(blank=True, help_text=b'A general dating of the artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.ChronologyCategory')),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Chronology Period',
                'verbose_name_plural': 'Chronology Periods',
            },
        ),
        migrations.CreateModel(
            name='CorrosionForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('form', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'ordering': ['form'],
                'verbose_name': 'Corrosion Form',
                'verbose_name_plural': 'Corrosion Forms',
            },
        ),
        migrations.CreateModel(
            name='CorrosionType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('type', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'ordering': ['type'],
                'verbose_name': 'Corrosion Type',
                'verbose_name_plural': 'Corrosion Types',
            },
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('document', models.FileField(help_text=b'The attached document', upload_to=artefacts.models.get_doc_storage_path)),
                ('name', models.CharField(blank=True, help_text=b'The document name', max_length=100)),
                ('artefact', models.ForeignKey(blank=True, help_text=b'The corresponding artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact')),
            ],
            options={
                'verbose_name': 'Document',
                'verbose_name_plural': 'Documents',
            },
        ),
        migrations.CreateModel(
            name='Environment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, help_text=b'The burial conditions of the artefact', max_length=100)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Environment',
                'verbose_name_plural': 'Environments',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('image', models.ImageField(blank=True, help_text=b'The image file', null=True, upload_to=artefacts.models.get_img_storage_path)),
                ('legend', models.CharField(blank=True, help_text=b'The image description', max_length=500)),
                ('order', models.IntegerField(blank=True, help_text=b'The order of an image for a given section', null=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Image',
                'verbose_name_plural': 'Images',
            },
        ),
        migrations.CreateModel(
            name='Metal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('element', models.CharField(blank=True, help_text=b'An element which is part of the artefact composition', max_length=2)),
            ],
            options={
                'ordering': ['element'],
                'verbose_name': 'Metal',
                'verbose_name_plural': 'Metals',
            },
        ),
        migrations.CreateModel(
            name='Microstructure',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Microstructure',
                'verbose_name_plural': 'Microstructures',
            },
        ),
        migrations.CreateModel(
            name='Origin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('site', models.CharField(blank=True, help_text=b'The place where the artefact was located', max_length=100)),
                ('city', models.ForeignKey(blank=True, help_text=b'The city where the artefact was located', null=True, on_delete=django.db.models.deletion.CASCADE, to='cities_light.City')),
            ],
            options={
                'ordering': ['site'],
                'verbose_name': 'Origin',
                'verbose_name_plural': 'Origins',
            },
        ),
        migrations.CreateModel(
            name='RecoveringDate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('date', models.CharField(blank=True, help_text=b'The date when the artefact was found', max_length=200)),
            ],
            options={
                'verbose_name': 'Recovering Date',
                'verbose_name_plural': 'Recovering Dates',
            },
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('title', models.CharField(blank=True, default=b'', help_text=b'The section title', max_length=100)),
                ('content', tinymce.models.HTMLField(blank=True, help_text=b'The content of the section')),
                ('order', models.IntegerField(blank=True, help_text=b'The order of a section for a given artefact', null=True)),
                ('complementary_information', tinymce.models.HTMLField(blank=True, default=b'', help_text=b'Complementary information')),
                ('artefact', models.ForeignKey(blank=True, help_text=b'The corresponding artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact')),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Section',
                'verbose_name_plural': 'Sections',
            },
        ),
        migrations.CreateModel(
            name='SectionCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(choices=[(b'AR', b'Artefact'), (b'SA', b'Sample'), (b'AN', b'Analysis and Results'), (b'CO', b'Conclusion'), (b'RE', b'References')], max_length=2)),
                ('order', models.IntegerField(blank=True, help_text=b'The order of a section category for a given artefact', null=True)),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'Section Category',
                'verbose_name_plural': 'Section Categories',
            },
        ),
        migrations.CreateModel(
            name='Stratigraphy',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('order', models.IntegerField(blank=True, help_text=b'The order of a stratigraphy for a given artefact', null=True)),
                ('uid', models.CharField(blank=True, help_text=b'The identification of the stratigraphy', max_length=500, null=True)),
                ('url', models.CharField(blank=True, help_text=b'The url that leads to the corresponding stratigraphy in the tool', max_length=500, null=True)),
                ('image', models.ImageField(blank=True, help_text=b'The image file for a stratigraphy', null=True, upload_to=artefacts.models.get_img_storage_path_stratigraphy)),
                ('artefact', models.ForeignKey(blank=True, help_text=b'The artefact the stratigraphy represents', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact')),
            ],
            options={
                'ordering': ['artefact', 'order'],
                'verbose_name': 'Stratigraphy',
                'verbose_name_plural': 'Stratigraphies',
            },
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, help_text=b'The manufacturing techniques used', max_length=100)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Technology',
                'verbose_name_plural': 'Technologies',
            },
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(blank=True, help_text=b'What the artefact was used for', max_length=200)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'Type',
                'verbose_name_plural': 'Types',
            },
        ),
        migrations.AddField(
            model_name='section',
            name='section_category',
            field=models.ForeignKey(blank=True, help_text=b'The corresponding section category', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.SectionCategory'),
        ),
        migrations.AddField(
            model_name='image',
            name='section',
            field=models.ForeignKey(blank=True, help_text=b'The corresponding section', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Section'),
        ),
    ]
