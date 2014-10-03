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
from django.utils.translation import ugettext_lazy as _

# Third-party app imports

# MiCorr imports


class TravisBuild(models.Model):
    """
    The historic of all builds pushed from Travis and the result of the automatic update.
    """
    number = models.CharField(verbose_name=_("number"), max_length=50, help_text=_("Travis build number"))
    type = models.CharField(verbose_name=_("type"), max_length=50, help_text=_("Request type (push/pull)"))
    commit = models.CharField(verbose_name=_("commit"), max_length=50, help_text=_("Revision number"))
    branch = models.CharField(verbose_name=_("branch"), max_length=50, help_text=_("Git branch"))
    message = models.CharField(verbose_name=_("message"), max_length=250, help_text=_("Git commit message"))
    committer_name = models.CharField(verbose_name=_("committer name"), max_length=50, help_text=_("Name of the committer"))
    update_status = models.CharField(verbose_name=_("update status"), max_length=50, blank=True, help_text=_("Current update status"))
    created = models.DateTimeField(verbose_name=_("created"), auto_now_add=True, help_text=_("Creation date"))

    class Meta:
        verbose_name = _('Travis build')
        verbose_name_plural = _('Travis builds')
        ordering = ['number']

    def __unicode__(self):
        return self.number
