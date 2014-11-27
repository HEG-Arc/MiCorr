# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$',  # noqa
        TemplateView.as_view(template_name='landing.html'),
        name="home"),
    url(r'^about/$',
        TemplateView.as_view(template_name='pages/about.html'),
        name="about"),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # User management
    url(r'^users/', include("users.urls", namespace="users")),
    url(r'^accounts/', include('allauth.urls')),

    # Uncomment the next line to enable avatars
    url(r'^avatar/', include('avatar.urls')),

    # Newsletter
    url(r'^newsletter/', include('newsletter.urls')),
    url(r'^tinymce/', include('tinymce.urls')),

    # Envelope (contact form)
    url(r'^contact/', include('envelope.urls')),

    # Your stuff: custom urls go here
    url(r'^dev/', include('deployment.urls')),

    # Artefacts management
    url(r'^artefacts/', include('artefacts.urls', namespace="artefacts")),

    # Django-terms app
    url(r'^terms/', include('terms.urls')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
