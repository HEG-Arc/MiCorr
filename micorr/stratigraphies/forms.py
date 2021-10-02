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
from users.models import User


class StratigraphyDescriptionUpdateForm(forms.Form):
    """
    Edit the description of a stratigraphy
    """
    attribute = forms.CharField(label='attribute', max_length=100)
    value = forms.CharField(label='value', max_length=100)


class ShareStratigraphyForm(forms.Form):

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        username = cleaned_data.get('username')
        if not email and not username:
            raise forms.ValidationError(
                "You must provide either an email address or a username"
            )
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                raise forms.ValidationError(f"User with username:{username} does not exist")
        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise forms.ValidationError(f"User with email:{email} does not exist")
        cleaned_data['user'] = user
        self.user = user

    email = forms.EmailField(label='email', required=False)
    username = forms.CharField(label='username', max_length=150, required=False)
    comment = forms.CharField(label='Personal comment', required=False)
    cc_myself = forms.BooleanField(label='Send a copy to myself', required=False)
