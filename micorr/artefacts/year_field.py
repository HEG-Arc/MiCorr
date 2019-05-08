from django.db import models
from django.core.exceptions import ValidationError
from django.forms import MultiWidget, NumberInput, Select, MultiValueField, IntegerField, ChoiceField, TextInput
from django.utils.translation import ugettext_lazy as _, ungettext_lazy

# YearField provides "Large year" support (out of datetime.date range [1-9999])
# widget, form and model fields to support any year entry of the form: YYYYYYYY... B.C/A.D
# backed by signed integer

class SplitYearWidget(MultiWidget):
    """
    A Widget that splits year input into <input type="number"> + <select> (A.D./B.C) boxes.
    """
    template_name = 'django/forms/widgets/multiwidget.html'

    def __init__(self, attrs=None, choices=((0, '----'),(-1,'B.C.'), (1,'A.D.'))):
        widgets = (
            NumberInput(attrs={'min':1}),
            Select(attrs=attrs, choices=choices),
        )
        super(SplitYearWidget, self).__init__(widgets, attrs)

    def decompress(self, value):
        if value:
            return [abs(value),1 if value >0 else -1]
        return [None, None]

class SplitYearField(MultiValueField):
    """
    A Widget that splits year input into <input type="number"> + <select> (A.D./B.C) boxes.
    """

    widget = SplitYearWidget

    default_error_messages = {
        'invalid_year': _('Enter a valid date.'),
        'invalid_era': _('Enter a valid era.'),
    }

    def __init__(self, *args, **kwargs):
        errors = self.default_error_messages.copy()
        if 'error_messages' in kwargs:
            errors.update(kwargs['error_messages'])
        localize = kwargs.get('localize', False)
        self.coerce = kwargs.pop('coerce', lambda val: val)
        choices = kwargs.pop('choices',((0, '----'),(-1,'B.C.'), (1,'A.D.')))

        fields = (
            IntegerField(required=False, min_value=1),
            ChoiceField(required=False, choices=choices),
        )
        super(SplitYearField, self).__init__(fields, *args, **kwargs)

    def compress(self, data_list):
        if data_list:
            # Raise a validation error if year or era is empty
            # (possible if SplitYearField has required=False).
            if data_list[0] in self.empty_values:
                return 0
                # raise ValidationError(self.error_messages['invalid_year'], code='invalid_year')
            if data_list[1] in self.empty_values:
                raise ValidationError(self.error_messages['invalid_era'], code='invalid_era')
            if data_list[1]=='0' and data_list[0]!=0:
                raise ValidationError(self.error_messages['invalid_era'], code='invalid_era')
            return data_list[0] *  int(data_list[1])
        return None

class YearField(models.IntegerField):
    def __init__(self, *args, **kwargs):
        super(YearField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {'form_class': SplitYearField}
        defaults.update(kwargs)
        return super(YearField, self).formfield(**defaults)

    def render_readonly_widget(self, attribute, value):
        """
        render the field's widget in readonly for displaying value outside of form
        :param attribute:
        :param value:
        :return: html rendering
        """
        widget = self.formfield().widget
        widget.attrs.update(disabled='disabled', readonly='readonly')
        return widget.render(attribute, value)

