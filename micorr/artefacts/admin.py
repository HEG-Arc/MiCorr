from django.contrib import admin
from .models import Metal, Type, Origin, ChronologyCategory, ChronologyPeriod, Environment, Technology, \
    MicrostructureType, Microstructure, \
    Corrosion, Artefact, Section, Image


class ArtefactAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Own fields', {'fields': ['inventory_number', 'description', 'initial_pub_date', 'additional_information']}),
        ('Foreign keys', {
            'fields': ['user', 'metal', 'type', 'origin', 'chronology_period', 'environment', 'technology',
                       'microstructure', 'corrosion']})
    ]
    list_display = ('id', 'metal_description', 'origin_country', 'origin', 'chronology_period')

    def metal_description(self, obj):
        metal = ""
        if obj.metal:
            metal = obj.metal.description
        return metal

    def origin_country(self, obj):
        country = ""
        if obj.origin:
            country = obj.origin.city.country.name
        return country


class SectionAdmin(admin.ModelAdmin):
    list_display = ('artefact', 'title', 'order')


class CorrosionAdmin(admin.ModelAdmin):
    list_display = ('form', 'type')


admin.site.register(Metal)
admin.site.register(Type)
admin.site.register(Origin)
admin.site.register(ChronologyCategory)
admin.site.register(ChronologyPeriod)
admin.site.register(Environment)
admin.site.register(Technology)
admin.site.register(MicrostructureType)
admin.site.register(Microstructure)
admin.site.register(Corrosion, CorrosionAdmin)
admin.site.register(Artefact, ArtefactAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Image)