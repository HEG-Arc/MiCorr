# -*- coding: utf-8 -*-


from django.views.generic import TemplateView
from django.views import defaults as default_views
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from .views import HomePageView
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from wagtail.contrib.wagtailsitemaps.views import sitemap as sitemap_wagtail
from wagtail.wagtailcore import urls as wagtail_urls
from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailsearch.urls import frontend as wagtailsearch_frontend_urls
from wagtail.wagtailsearch.signal_handlers import register_signal_handlers as wagtailsearch_register_signal_handlers

from config.sitemaps import ArtefactsSitemap, HomePageSitemap
from .views import HomePageView
admin.autodiscover()
wagtailsearch_register_signal_handlers()

sitemaps = {
    'artefact': ArtefactsSitemap,
    'home': HomePageSitemap,
}

urlpatterns = [
    url(r'^$', HomePageView.as_view(), name="home"),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # User management
    url(r'^users/', include("users.urls", namespace="users")),
    url(r'^accounts/', include('allauth.urls')),

    # Uncomment the next line to enable avatars
    url(r'^avatar/', include('avatar.urls')),

    # Newsletter
    #url(r'^newsletter/', include('newsletter.urls')),
    url(r'^tinymce/', include('tinymce.urls')),

    # Envelope (contact form)
    #url(r'^contact/', include('envelope.urls')),

    # Your stuff: custom urls go here
    #url(r'^dev/', include('deployment.urls')),

    # Artefacts management
    url(r'^artefacts/', include('artefacts.urls')),

    # Contacts management
    url(r'^contacts/', include('contacts.urls')),

    # Django-terms app
    url(r'^terms/', include('terms.urls')),

    # Sitemaps
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps},
    name='django.contrib.sitemaps.views.sitemap'),

    url(r'^sitemap-wagtail\.xml$', sitemap_wagtail),

    # Robots
    url(r'^robots\.txt', include('robots.urls')),

    # Stratigraphies
    url(r'^micorr/', include('stratigraphies.urls', namespace="stratigraphies")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    import debug_toolbar
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception('Bad Request!')}),
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception('Permission Denied')}),
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception('Page not Found')}),
        url(r'^500/$', default_views.server_error),
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

# Wagtail URLS
urlpatterns += [
    url(r'^w/admin/', include(wagtailadmin_urls)),
    url(r'^w/search/', include(wagtailsearch_frontend_urls)),
    url(r'^w/documents/', include(wagtaildocs_urls)),

    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's serving mechanism
    url(r'', include(wagtail_urls)),
]

