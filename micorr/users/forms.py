# -*- coding: utf-8 -*-
from django import forms
from allauth.account.forms import SignupForm
from captcha.fields import CaptchaField,CaptchaTextInput

from users.models import User


class UserForm(forms.ModelForm):

    class Meta:
        # Set this form to use the User model.
        model = User

        # Constrain the UserForm to just these fields.
        fields = ("first_name", "last_name")


class CaptchaSignupForm(SignupForm):
    captcha = CaptchaField(widget=CaptchaTextInput(attrs={'class': 'form-control textInput',
                                                          'placeholder': 'Captcha content'}))

    def __init__(self, *args, **kw):
        super().__init__(*args, **kw)
        field_order = list(self.fields.keys())
        # get current fields and move catpcha to the end
        field_order.remove('captcha')
        field_order.append('captcha')
        self.order_fields(field_order)

    def save(self, request):

        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(CaptchaSignupForm, self).save(request)

        # Add your own processing here.

        # You must return the original result.
        return user
