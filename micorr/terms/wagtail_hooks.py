from wagtail.contrib.modeladmin.options import ModelAdmin, modeladmin_register
from .models import Term



class TermModelAdmin(ModelAdmin):
    model = Term
    menu_label = 'Glossary'  # ditch this to use verbose_name_plural from model
    menu_icon = 'openquote'  # change as required
    menu_order = 600  # will put in 7th place (000 being 1st, 100 2nd)
    add_to_settings_menu = False  # or True to add your model to the Settings sub-menu
    exclude_from_explorer = False # or True to exclude pages of this type from Wagtail's explorer view
    list_display = ('name', 'definition', 'url')
    list_filter = None # ('case_sensitive', 'url')
    search_fields = ('name',)
    ordering = ('name',)

# Now you just need to register your customised ModelAdmin class with Wagtail
modeladmin_register(TermModelAdmin)

