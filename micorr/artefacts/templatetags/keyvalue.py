from django import template
register = template.Library()

@register.filter
def keyvalue(dict, key):
    try:
        return dict[key]
    except TypeError as KeyError:
        return ''
