# adapted from https://gist.github.com/FZambia/5393983
from collections import OrderedDict

from django import forms
from django.forms.forms import BoundField


class BoundFieldset(object):

    def __init__(self, form, name, title, fields, is_fieldset):
        self.form = form
        self.name = name
        self.title = title
        self.fields = fields
        self.is_fieldset = is_fieldset

    def __iter__(self):
        for name, field in self.fields.items():
            yield BoundField(self.form, field, name)


class FieldsetForm(forms.ModelForm):
    """
    Form with fieldsets.

    Usage. In `forms.py`:

    class MyForm(FieldsetForm):

        email = forms.CharField()
        first_name = forms.CharField()
        last_name = forms.CharField()

        about = forms.CharField(widget=forms.Textarea)

        fieldsets = (
            {
                "name": "required",
                "title": u"required fields",
                "is_fieldset": True,
                "fields": ['email', 'first_name', 'last_name']
            },{
                "name": "optional",
                "title": u"optional fields",
                "is_fieldset": True,
                "fields": ['about']
            }
        )


    In template:

    {% for fieldset in form %}
        {% if fieldset.is_fiedset %}
            <fieldset>
            {{fieldset.title}}
        {% endif %}

        {% for field in fieldset %}

            {% if not field.is_hidden %}
                {{field.label_tag}}
            {% endif %}

            {% if field.help_text %}
                {{field.help_text}}
            {% endif %}

            {{field}}

            {{field.errors}}

        {% endfor %}

        {% if fieldset.is_fiedset %}
            </fieldset>
        {% endif %}
    {% endfor %}

    """

    def __init__(self, *args, **kwargs):
        super(FieldsetForm, self).__init__(*args, **kwargs)

        self._fieldset_fields = OrderedDict()

        # create matches between fieldset names and form fields
        for name, field in self.fields.items():
            for fieldset in self.fieldsets:
                fieldset_name = fieldset.get("name")
                if name in fieldset.get('fields', []):
                    if fieldset_name not in self._fieldset_fields:
                        self._fieldset_fields[fieldset_name] = OrderedDict()
                    self._fieldset_fields[fieldset_name][name] = field

    def __iter__(self):
        for fieldset in self.fieldsets:
            name = fieldset.get("name")
            title = fieldset.get("title", name)
            fields = self._fieldset_fields.get(name, OrderedDict())
            is_fieldset = fieldset.get("is_fieldset", True)
            yield BoundFieldset(self, name, title, fields, is_fieldset)

    def get_fieldset(self, item):
        fields = self._fieldset_fields.get(item, OrderedDict())
        return BoundFieldset(self, item, "", fields, True)
