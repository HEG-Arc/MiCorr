# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from views import HomePageView
from django.contrib.sitemaps.views import sitemap
from sitemaps import ArtefactsSitemap, HomePageSitemap
from wagtail.contrib.wagtailsitemaps.views import sitemap as sitemap_wagtail

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

sitemaps = {
    'artefact': ArtefactsSitemap,
    'home': HomePageSitemap,
}

urlpatterns = patterns('',
    url(r'^$',  # noqa
        HomePageView.as_view(),
        name="home"),

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

    # Sitemaps
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps},
    name='django.contrib.sitemaps.views.sitemap'),

    url(r'^sitemap-wagtail\.xml$', sitemap_wagtail),

    # Robots
    url(r'^robots\.txt$', include('robots.urls')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Wagtail URLS
from wagtail.wagtailcore import urls as wagtail_urls
from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailsearch.urls import frontend as wagtailsearch_frontend_urls


from wagtail.wagtailsearch.signal_handlers import register_signal_handlers as wagtailsearch_register_signal_handlers
wagtailsearch_register_signal_handlers()

urlpatterns += patterns('',
    url(r'^w/admin/', include(wagtailadmin_urls)),
    url(r'^w/search/', include(wagtailsearch_frontend_urls)),
    url(r'^w/documents/', include(wagtaildocs_urls)),

    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's serving mechanism
    url(r'', include(wagtail_urls)),
)