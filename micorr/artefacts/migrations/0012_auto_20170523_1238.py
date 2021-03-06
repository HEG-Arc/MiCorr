# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-05-23 10:38


from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artefacts', '0011_auto_20170522_2307'),
    ]

    operations = [
        migrations.AddField(
            model_name='collaboration_comment',
            name='user',
            field=models.ForeignKey(blank=True, help_text='The user who wrote the comment', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_commenting', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='field',
            name='title',
            field=models.CharField(blank=True, help_text='A field for the name without spaces', max_length=200),
        ),
    ]
