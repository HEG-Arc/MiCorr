# Generated by Django 3.0.14 on 2021-12-22 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artefacts', '0053_sectiontemplate_add_titles'),
    ]

    operations = [
        migrations.AddField(
            model_name='sectiontemplate',
            name='title_title',
            field=models.TextField(blank=True, default='', help_text='Text displayed when mouse is hovering title'),
        ),
    ]
