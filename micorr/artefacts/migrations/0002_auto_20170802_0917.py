# -*- coding: utf-8 -*-


from django.db import models, migrations
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0001_initial'),
    ]
    replaces = [('artefacts', '0002_auto_20161019_1615')]

    operations = [
        migrations.AlterField(
            model_name='artefact',
            name='author',
            field=models.ManyToManyField(help_text='The author(s) of this file is (are) responsible for the information provided. Author(s) should provide their last name, initial of their first name and in brackets the abbreviation of their institutional affiliation, such as Degrigny C. (HE-Arc CR).', related_name='artefacts', verbose_name='authors', to='contacts.Contact', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='artefacts_locations', blank=True, to='contacts.Contact', help_text='The actual location of the artefact', null=True, verbose_name='artefact location'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='metal1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='first_metal_artefacts', blank=True, to='artefacts.Metal', help_text='The primary metal element of the artefact', null=True, verbose_name='1st metal element'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='metalx',
            field=models.ManyToManyField(help_text='The other metal elements of the artefact.', related_name='other_metal_artefacts', verbose_name='other metal elements', to='artefacts.Metal', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='microstructure',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,blank=True, to='artefacts.Microstructure', help_text='A description of the metal: its composition, texture (porosity), hardness, microstructure revealed by etching and specific features (figures and tables are referred as Fig. 1, Table 1)', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='origin',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='artefacts', blank=True, to='artefacts.Origin', help_text='The place, city and country where the artefact comes from or the object to which the section considered belongs to', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='artefacts_owners', blank=True, to='contacts.Contact', help_text='The owner of the artefact', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='responsible_institution',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='responsible_institution', blank=True, to='contacts.Contact', help_text='The responsible institution for the artefact sample', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='artefact',
            name='sample_location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name='sample_location', blank=True, to='contacts.Contact', help_text='The actual location of the artefact sample', null=True),
            preserve_default=True,
        ),
    ]
