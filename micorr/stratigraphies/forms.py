# -*- coding: UTF-8 -*-
# forms.py
#
# Copyright (C) 2016 HES-SO//HEG Arc
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
from django import forms
from django.forms import TextInput

# Third-party app imports

# MiCorr imports


class StratigraphyDescriptionUpdateForm(forms.Form):
    """
    Edit the description of a stratigraphy
    """
    description = forms.CharField(label='Description', max_length=100)
