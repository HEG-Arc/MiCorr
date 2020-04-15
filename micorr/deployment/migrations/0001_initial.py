# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TravisBuild',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.CharField(help_text='Travis build number', max_length=50, verbose_name='number')),
                ('type', models.CharField(help_text='Request type (push/pull)', max_length=50, verbose_name='type')),
                ('commit', models.CharField(help_text='Revision number', max_length=50, verbose_name='commit')),
                ('branch', models.CharField(help_text='Git branch', max_length=50, verbose_name='branch')),
                ('message', models.CharField(help_text='Git commit message', max_length=250, verbose_name='message')),
                ('committer_name', models.CharField(help_text='Name of the committer', max_length=50, verbose_name='committer name')),
                ('out', models.TextField(help_text='Output of the deploy script', verbose_name='Stdout output', blank=True)),
                ('error', models.TextField(help_text='Errors of the deploy script', verbose_name='Stdout errors', blank=True)),
                ('update_status', models.CharField(default='Started', help_text='Current update status', max_length=50, verbose_name='update status', blank=True)),
                ('created', models.DateTimeField(help_text='Creation date', verbose_name='created', auto_now_add=True)),
            ],
            options={
                'ordering': ['number'],
                'verbose_name': 'Travis build',
                'verbose_name_plural': 'Travis builds',
            },
            bases=(models.Model,),
        ),
    ]
