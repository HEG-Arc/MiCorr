from django.contrib import admin
from .models import Metal, Alloy, Type, Origin, RecoveringDate, ChronologyCategory, ChronologyPeriod, Environment, \
    Technology, \
    Microstructure, CorrosionForm, CorrosionType, Artefact, SectionCategory, Section, Image, Document


class ArtefactAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Own fields', {
            'fields': ['description', 'inventory_number', 'recorded_conservation_data',
                       'sample_description', 'sample_number', 'date_aim_sampling']}),
        ('Foreign keys', {
            'fields': ['user', 'metal1', 'metalx', 'alloy', 'type', 'origin', 'recovering_date', 'chronology_period',
                       'environment', 'location', 'owner', 'technology', 'sample_location',
                       'responsible_institution', 'microstructure']})
    ]
    list_display = ('id', 'inventory_number', 'alloy', 'chronology_category', 'origin_country')

    def origin_country(self, obj):
        country = ""
        if obj.origin:
            country = obj.origin.city.country.name
        return country

    def chronology_category(self, obj):
        chronology = ""
        if obj.chronology_period:
            chronology = obj.chronology_period.chronology_category
        return chronology


class SectionCategoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'name')


class SectionAdmin(admin.ModelAdmin):
    list_display = ('order', 'artefact', 'section_category')


class ImageAdmin(admin.ModelAdmin):
    list_display = ('section', 'legend')


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'artefact', 'name')


admin.site.register(Metal)
admin.site.register(Alloy)
admin.site.register(Type)
admin.site.register(Origin)
admin.site.register(RecoveringDate)
admin.site.register(ChronologyCategory)
admin.site.register(ChronologyPeriod)
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