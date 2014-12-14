# -*- coding: UTF-8 -*-
# models.py
#
# Copyright (C) 2014 HES-SO//HEG Arc
#
# Author(s): Cédric Gaspoz <cedric.gaspoz@he-arc.ch>
#
# This file is part of MiCorr.
#
# MiCorr is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# MiCorr is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with MiCorr. If not, see <http://www.gnu.org/licenses/>.

# Stdlib imports

# Core Django imports
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

# Third-party app imports
from django_extensions.db.models import TimeStampedModel
from cities_light.models import Country, Region, City

# MiCorr imports
from users.models import User


class Contact(TimeStampedModel):
    """
    An individual or organization contact who is somehow linked to MiCorr database items. A contact is not necessary
    a user of MiCorr (somebody with an account to log in) but can be one. A contact may also be the child of another
    contact (for example, students can be children of their school contact).
    """
    user = models.OneToOneField(User, verbose_name=_('user'), related_name=_('contact'), blank=True, null=True, help_text=_("If this contact is also a user, it's user account."))
    parent = models.ForeignKey('Contact', verbose_name=_("parent"), related_name=_('members'), blank=True, null=True, help_text=_("Specify one parent to create dependencies between contacts."))
    organization_name = models.CharField(verbose_name=_("organization name"), max_length=250, blank=True, default='', help_text=_("Name of the organization (leave empty if this is an individual contact."))
    organization_complement = models.CharField(verbose_name=_("organization complement"), max_length=250, blank=True, default='', help_text=_("Complement of the organization name (could be a department, ... Leave empty if this is an individual contact."))
    name = models.CharField(verbose_name=_("name"), max_length=250, blank=True, default='', help_text=_("Name of the individual or the contact (in case of an organization contact)."))
    middle_name = models.CharField(verbose_name=_("middle name"), max_length=50, blank=True, default='', help_text=_("Middle name of the individual or the contact (in case of an organization contact)."))
    surname = models.CharField(verbose_name=_("surname"), max_length=250, blank=True, default='', help_text=_("Surname of the individual or the contact (in case of an organization contact)."))
    address_line_1 = models.CharField(verbose_name=_("address line 1"), max_length=250, blank=True, default='', help_text=_("First line of the address."))
    address_line_2 = models.CharField(verbose_name=_("address line 2"), max_length=250, blank=True, default='', help_text=_("Second line of the address."))
    address_line_3 = models.CharField(verbose_name=_("address line 3"), max_length=250, blank=True, default='', help_text=_("Third line of the address."))
    country = models.ForeignKey(Country, verbose_name=_("country"), blank=True, null=True, help_text=_("Country (from geo database)"))
    region = models.ForeignKey(Region, verbose_name=_("region/state"), blank=True, null=True, help_text=_("Region or state (from geo database)"))
    city = models.ForeignKey(City, verbose_name=_("city"), blank=True, null=True, help_text=_("City (from geo database)"))
    zip_code = models.CharField(verbose_name=_("zip code"), max_length=250, blank=True, default='', help_text=_("Zip code of the city."))
    url = models.URLField(verbose_name=_("url"), max_length=250, blank=True, null=True, help_text=_("URL of the personal or organization website."))
    email = models.EmailField(verbose_name=_("email"), max_length=250, blank=True, null=True, help_text=_("Email address."))
    fon = models.CharField(verbose_name=_("fon number"), max_length=20, blank=True, default='', help_text=_("Enter the number in the format: +41 32 930 2088 (without dashes or non numerical characters)."))
    mobile = models.CharField(verbose_name=_("mobile fon number"), max_length=20, blank=True, default='', help_text=_("Enter the number in the format: +41 79 930 2088 (without dashes or non numerical characters)."))

    class Meta:
        verbose_name = _('Contact')
        verbose_name_plural = _('Contacts')
        ordering = ['organization_name', 'name', 'surname']

    def __unicode__(self):
        formatted = None
        contact = []
        if self.organization_name:
            formatted = self.organization_name
        if self.name:
            if self.surname:
                contact.append(self.surname)
            if self.middle_name:
                contact.append(self.middle_name)
            contact.append(self.name)
            if formatted:
                formatted += " (%s)" % ' '.join(contact)
            else:
                formatted = ' '.join(contact)
        if self.city:
            formatted += ", %s" % self.city.name
        if self.region:
            formatted += ", %s" % self.region.name
        return formatted

