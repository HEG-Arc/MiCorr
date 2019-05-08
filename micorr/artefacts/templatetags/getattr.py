from django import template
register = template.Library()

@register.filter
def getattr (obj, args):
    """ Try to get an attribute from an object.

    Example: {% if block|getattr:"editable,True" %}

    Beware that the default is always a string, if you want this
    to return False, pass an empty second argument:
    {% if block|getattr:"editable," %}
    """
    if ',' in args:
        (attribute, default) = args.split(',')
    else:
        (attribute, default) = args, ''
    try:
        value = obj.__getattribute__(attribute)
    except AttributeError:
         value =  obj.__dict__.get(attribute, default)
    except:
        value = default

    # handling ManyToManyField case (django.db.models.fields.related_descriptors.ManyRelatedManager)
    # ManyRelatedManager is a private class defined inside create_forward_many_to_many_manager()
    # we can't use isinstance to identify ManyToMany field
    # so we use duck types instead
    if hasattr(value, 'all'):
        value = ', '.join([str(e) for e in value.all()])

    # using custom formfield widget for readonly rendering in detail view
    if hasattr(obj,'_meta'):
        field = obj._meta.get_field(attribute)
        if hasattr(field, 'render_readonly_widget'):
            value = field.render_readonly_widget(attribute, value)

    return value
