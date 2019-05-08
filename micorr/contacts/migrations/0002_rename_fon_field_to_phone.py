# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-09 09:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contact',
            old_name='fon',
            new_name='phone',
        ),
        migrations.AlterField(
            model_name='contact',
            name='phone',
            field=models.CharField(blank=True, default=b'', help_text='Enter the number in the format: +41 32 930 2088 (without dashes or non numerical characters).', max_length=20, verbose_name='phone number'),
        ),
        migrations.AlterField(
            model_name='contact',
            name='mobile',
            field=models.CharField(blank=True, default=b'', help_text='Enter the number in the format: +41 79 930 2088 (without dashes or non numerical characters).', max_length=20, verbose_name='mobile phone number'),
        ),
    ]