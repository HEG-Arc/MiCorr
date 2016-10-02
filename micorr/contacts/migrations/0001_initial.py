# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        #('cities_light', '0004_auto_20160301_1405'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, verbose_name='created', editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, verbose_name='modified', editable=False, blank=True)),
                ('organization_name', models.CharField(default=b'', help_text='Name of the organization (leave empty if this is an individual contact.', max_length=250, verbose_name='organization name', blank=True)),
                ('organization_complement', models.CharField(default=b'', help_text='Complement of the organization name (could be a department, ... Leave empty if this is an individual contact.', max_length=250, verbose_name='organization complement', blank=True)),
                ('name', models.CharField(default=b'', help_text='Name of the individual or the contact (in case of an organization contact).', max_length=250, verbose_name='name', blank=True)),
                ('middle_name', models.CharField(default=b'', help_text='Middle name of the individual or the contact (in case of an organization contact).', max_length=50, verbose_name='middle name', blank=True)),
                ('surname', models.CharField(default=b'', help_text='Surname of the individual or the contact (in case of an organization contact).', max_length=250, verbose_name='surname', blank=True)),
                ('address_line_1', models.CharField(default=b'', help_text='First line of the address.', max_length=250, verbose_name='address line 1', blank=True)),
                ('address_line_2', models.CharField(default=b'', help_text='Second line of the address.', max_length=250, verbose_name='address line 2', blank=True)),
                ('address_line_3', models.CharField(default=b'', help_text='Third line of the address.', max_length=250, verbose_name='address line 3', blank=True)),
                ('zip_code', models.CharField(default=b'', help_text='Zip code of the city.', max_length=250, verbose_name='zip code', blank=True)),
                ('url', models.URLField(help_text='URL of the personal or organization website.', max_length=250, null=True, verbose_name='url', blank=True)),
                ('email', models.EmailField(help_text='Email address.', max_length=250, null=True, verbose_name='email', blank=True)),
                ('fon', models.CharField(default=b'', help_text='Enter the number in the format: +41 32 930 2088 (without dashes or non numerical characters).', max_length=20, verbose_name='fon number', blank=True)),
                ('mobile', models.CharField(default=b'', help_text='Enter the number in the format: +41 79 930 2088 (without dashes or non numerical characters).', max_length=20, verbose_name='mobile fon number', blank=True)),
                ('city', models.ForeignKey(blank=True, to='cities_light.City', help_text='City (from geo database)', null=True, verbose_name='city')),
                ('country', models.ForeignKey(blank=True, to='cities_light.Country', help_text='Country (from geo database)', null=True, verbose_name='country')),
                ('parent', models.ForeignKey(related_name='members', blank=True, to='contacts.Contact', help_text='Specify one parent to create dependencies between contacts.', null=True, verbose_name='parent')),
                ('region', models.ForeignKey(blank=True, to='cities_light.Region', help_text='Region or state (from geo database)', null=True, verbose_name='region/state')),
                ('user', models.OneToOneField(related_name='contact', null=True, to=settings.AUTH_USER_MODEL, blank=True, help_text="If this contact is also a user, it's user account.", verbose_name='user')),
            ],
            options={
                'ordering': ['organization_name', 'name', 'surname'],
                'verbose_name': 'Contact',
                'verbose_name_plural': 'Contacts',
            },
            bases=(models.Model,),
        ),
    ]
