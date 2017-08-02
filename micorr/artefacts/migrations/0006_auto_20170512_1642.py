# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-05-12 14:42
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artefacts', '0005_datamigration_artefact_to_object'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collaboraton_comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('comment', models.CharField(blank=True, help_text=b'A comment from the collaborator or author', max_length=500)),
                ('isSent', models.BooleanField(default=False)),
                ('parent', models.ForeignKey(blank=True, help_text=b'The comment from which this comment is the child', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Collaboraton_comment')),
                ('token', models.ForeignKey(blank=True, help_text=b'The token linked to the comments', on_delete=django.db.models.deletion.CASCADE, to='artefacts.Token')),
            ],
            options={
                'verbose_name': 'Comment',
                'verbose_name_plural': 'Comments',
            },
        ),
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('comment', models.CharField(blank=True, help_text=b'A comment from the analyzer of the artefact', max_length=500, null=True)),
            ],
            options={
                'verbose_name': 'Publication',
                'verbose_name_plural': 'Publications',
            },
        ),
        migrations.RemoveField(
            model_name='artefact',
            name='name',
        ),
        migrations.RemoveField(
            model_name='artefact',
            name='user',
        ),
        migrations.AlterField(
            model_name='artefact',
            name='object',
            field=models.ForeignKey(blank=True, help_text=b'Name of the artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Object', verbose_name=b'object described'),
        ),
        migrations.AlterField(
            model_name='artefact',
            name='parent',
            field=models.ForeignKey(blank=True, help_text=b'The card from which this card is the child', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact'),
        ),
        migrations.AddField(
            model_name='publication',
            name='artefact',
            field=models.ForeignKey(blank=True, help_text=b'Artefact card sent for publication', on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact'),
        ),
        migrations.AddField(
            model_name='publication',
            name='delegated_user',
            field=models.ForeignKey(blank=True, help_text=b'Delegated user for the analyzis of the artefact', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='delegated_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='publication',
            name='user',
            field=models.ForeignKey(blank=True, help_text=b'User analyzing the artefact', on_delete=django.db.models.deletion.CASCADE, related_name='main_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
