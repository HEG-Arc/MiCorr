# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-05-15 13:51


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('artefacts', '0008_auto_20170515_1142'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collaboraton_comment',
            name='token',
        ),
        migrations.RemoveField(
            model_name='field',
            name='ordering',
        ),
        migrations.AddField(
            model_name='collaboraton_comment',
            name='content_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='collaboraton_comment',
            name='object_model_id',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='collaboraton_comment',
            name='comment',
            field=models.TextField(),
        ),
    ]
