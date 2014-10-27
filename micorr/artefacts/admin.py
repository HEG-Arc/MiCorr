from django.contrib import admin
from .models import Metal, Type, Origin, Chronology, Environment, Technology, MicrostructureType, Microstructure, \
    Corrosion, Artefact, Section, Image


class ArtefactAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Own fields', {'fields': ['inventory_number', 'description', 'initial_pub_date', 'additional_information']}),
        ('Foreign keys', {
            'fields': ['user', 'metal', 'type', 'origin', 'chronology', 'environment', 'owner', 'technology',
                       'microstructure', 'corrosion']})
    ]
    list_display = ('id', 'metal', 'type')


admin.site.register(Metal)
admin.site.register(Type)
admin.site.register(Origin)
admin.site.register(Chronology)
admin.site.register(Environment)
admin.site.register(Technology)
admin.site.register(MicrostructureType)
admin.site.register(Microstructure)
admin.site.register(Corrosion)
admin.site.register(Artefact, ArtefactAdmin)
admin.site.register(Section)
admin.site.register(Image)