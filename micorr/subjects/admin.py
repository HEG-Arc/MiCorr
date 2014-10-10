from django.contrib import admin
from subjects.models import Subject


class SubjectAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user']}),
        ('Basic information', {'fields': ['metal', 'name']}),
        ('Context', {'fields': ['origin', 'chronology', 'environment']}),
        ('Conservation', {'fields': ['owner', 'technology']}),
        ('Corrosion', {'fields': ['microstructure', 'corrosion_form', 'corrosion_type']}),
        ('Additional information', {'fields': ['image', 'pub_date']}),
    ]
    list_display = ('metal', 'name', 'user', 'pub_date')
    search_fields = ['metal']

admin.site.register(Subject, SubjectAdmin)