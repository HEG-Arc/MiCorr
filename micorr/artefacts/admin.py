from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Alloy, Type, Origin, RecoveringDate, ChronologyCategory, Environment, \
    Technology, Microstructure, CorrosionForm, CorrosionType, Artefact, SectionCategory, Section, Image, \
    Document, Stratigraphy, Object, Publication, Collaboration_comment

def linkify(field_name):
    """
    Converts a foreign key value into clickable links.

    If field_name is 'parent', link text will be str(obj.parent)
    Link will be admin url for the admin url for obj.parent.id:change
    """
    def _linkify(obj):
        linked_obj = getattr(obj, field_name)
        if linked_obj:
            model_name = linked_obj._meta.model_name
            app_label = linked_obj._meta.app_label
            view_name = u'admin:{}_{}_change'.format(app_label, model_name)
            link_url = reverse(view_name, args=[linked_obj.id])
            return format_html(u'<a href="{}">{}</a>', link_url, linked_obj)
        else:
            return u'-'

    _linkify.short_description = field_name # Sets column name
    return _linkify


class ArtefactAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Own fields', {
            'fields': ['description', 'inventory_number', 'recorded_conservation_data',
                       'sample_description', 'sample_number', 'date_aim_sampling','chronology_tpq','chronology_taq','chronology_comment']}),
        ('Foreign keys', {
            'fields': ['author', 'metal_e_1', 'metal_e_x', 'alloy', 'type', 'origin', 'recovering_date', 'chronology_category',
                       'environment', 'location', 'owner', 'technology', 'sample_location',
                       'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type', 'object']})
    ]
    ordering = ['-modified']

    def url(self, obj):
        return '<a href="%s">view on site</a>' % obj.get_absolute_url()

    url.allow_tags = True
    def user(self, obj):
        return obj.object.user if obj.object else '-' # obj.get_authors_email()
    user.admin_order_field = 'object__user'


    list_display = ('id','url',linkify('object'), 'user','modified','inventory_number', 'alloy', 'origin_country', linkify('chronology_category'),'chronology_tpq','chronology_taq','chronology_comment')
    list_filter = ['chronology_category','object__user']
    date_hierarchy = 'modified'

    def origin_country(self, obj):
        country = ""
        if obj.origin:
            if obj.origin.city:
                country = obj.origin.city.country.name
        return country


class ChronologyCategoryAdmin(admin.ModelAdmin):
    list_display = ('name','order','tpq','taq')


class ArtefactInline(admin.StackedInline):
    model = Artefact
    extra = 0
    fieldsets = [
        ('Own fields', {'fields': ['id','validated','published']}),
        ('Foreign keys', {
            'fields': ['object', 'type', 'origin', 'author', 'chronology_category']})
    ]



class AlloyAdmin(admin.ModelAdmin):

    def artefact_count(self, instance):
        return instance.artefact_set.count()

    artefact_count.short_description = "Artefact Count"

    inlines = (ArtefactInline,)

    list_display = ('id', 'name', 'order', 'artefact_count')


class SectionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')


class SectionAdmin(admin.ModelAdmin):
    list_display = ('artefact','order')


class ImageAdmin(admin.ModelAdmin):
    list_display = ('section', 'legend')


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'artefact', 'name')


class StratigraphyAdmin(admin.ModelAdmin):
    list_display = ('artefact', 'order', 'uid', 'url')

class ObjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', linkify('user'),'modified')
    inlines = (ArtefactInline,)
    list_filter = ['user']
    ordering = ['-modified']

class PublicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')

admin.site.register(Alloy, AlloyAdmin)
admin.site.register(Type)
admin.site.register(Origin)
admin.site.register(RecoveringDate)
admin.site.register(ChronologyCategory, ChronologyCategoryAdmin)
admin.site.register(Environment)
admin.site.register(Technology)
admin.site.register(Microstructure)
admin.site.register(CorrosionForm)
admin.site.register(CorrosionType)
admin.site.register(Artefact, ArtefactAdmin)
admin.site.register(SectionCategory, SectionCategoryAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Stratigraphy, StratigraphyAdmin)
admin.site.register(Object, ObjectAdmin)
admin.site.register(Publication, PublicationAdmin)
admin.site.register(Collaboration_comment)
