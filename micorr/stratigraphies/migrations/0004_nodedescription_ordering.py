# Generated by Django 3.0.14 on 2021-12-22 15:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stratigraphies', '0003_datamigration_node_descriptions'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='nodedescription',
            options={'ordering': ['name']},
        ),
    ]
