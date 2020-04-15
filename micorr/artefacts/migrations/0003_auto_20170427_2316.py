# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-04-27 21:16


from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artefacts', '0002_auto_20170802_0917'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('uuid', models.CharField(max_length=50)),
                ('right', models.CharField(choices=[('R', 'Read'), ('W', 'Write')], default='R', max_length=1)),
                ('comment', models.CharField(max_length=100, null=True)),
                ('already_used', models.BooleanField(default=False)),
                ('recipient', models.CharField(max_length=100)),
                ('link', models.CharField(max_length=200, null=True)),
            ],
            options={
                'verbose_name': 'Token',
                'verbose_name_plural': 'Tokens',
            },
            managers=[
                ('tokenManager', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AddField(
            model_name='artefact',
            name='validated',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='token',
            name='artefact',
            field=models.ForeignKey(help_text='The shared artefact', null=True, on_delete=django.db.models.deletion.CASCADE, to='artefacts.Artefact'),
        ),
        migrations.AddField(
            model_name='token',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name="user's object"),
        ),
    ]
