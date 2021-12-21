# Generated by Django 3.0.14 on 2021-12-21 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0052_datamigration_artefactfromdescription_instructions'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='formdescription',
            options={'ordering': ['name']},
        ),
        migrations.AddField(
            model_name='sectiontemplate',
            name='images_title',
            field=models.TextField(blank=True, default='Add a picture or a drawing', help_text='text displayed when mouse is hovering images "+" '),
        ),
        migrations.AddField(
            model_name='sectiontemplate',
            name='stratigraphies_title',
            field=models.TextField(blank=True, default='Add a stratigraphy', help_text='text displayed when mouse is hovering stratigraphies "+" '),
        ),
        migrations.AlterField(
            model_name='sectiontemplate',
            name='images_help_text',
            field=models.TextField(blank=True, default='', help_text='Help text displayed under images "+"'),
        ),
        migrations.AlterField(
            model_name='sectiontemplate',
            name='stratigraphies_help_text',
            field=models.TextField(blank=True, default='', help_text='Help text displayed under stratigraphies "+"'),
        ),
    ]
