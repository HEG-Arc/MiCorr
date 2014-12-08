from django.contrib import admin
from .models import Metal, Alloy, Type, Origin, ChronologyCategory, ChronologyPeriod, Environment, Technology, \
    Microstructure, Corrosion, Artefact, SectionCategory, Section, Image, Document


class ArtefactAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Own fields', {'fields': ['description', 'complementary_information']}),
        ('Foreign keys', {
            'fields': ['user', 'metal1', 'metalx', 'alloy', 'type', 'origin', 'recovering_date', 'chronology_period',
                       'environment', 'location', 'technology', 'microstructure', 'corrosion']})
    ]
    list_display = ('id', 'metal1', 'chronology_category', 'origin_country')

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


class SectionAdmin(admin.ModelAdmin):
    list_display = ('artefact', 'title', 'order')


class CorrosionAdmin(admin.ModelAdmin):
    list_display = ('form', 'type')


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'artefact', 'name')


admin.site.register(Metal)
admin.site.register(Alloy)
admin.site.register(Type)
admin.site.register(Origin)
admin.site.register(ChronologyCategory)
admin.site.register(ChronologyPeriod)
admin.site.register(Environment)
admin.site.register(Technology)
admin.site.register(Microstructure)
admin.site.register(Corrosion, CorrosionAdmin)
admin.site.register(Artefact, ArtefactAdmin)
admin.site.register(SectionCategory)
admin.site.register(Section, SectionAdmin)
admin.site.register(Image)
admin.site.register(Document, DocumentAdmin)