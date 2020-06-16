# -*- coding: utf-8 -*-
"""
Django settings for micorr project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""


import os

import environ

ROOT_DIR = environ.Path(__file__) - 3  # (micorr/config/settings/common.py - 3 = micorr/)
APPS_DIR = ROOT_DIR.path('micorr')

env = environ.Env()

# APP CONFIGURATION
# ------------------------------------------------------------------------------
DJANGO_APPS = (
    # Default Django apps:
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',

    # Useful template tags:
    # 'django.contrib.humanize',
    'dal',
    'dal_select2',
    'dal_legacy_static',
    # Admin
    'django.contrib.admin',
)
THIRD_PARTY_APPS = (
    'crispy_forms',  # Form layouts
    'avatar',  # for user avatars
    'allauth',  # registration
    'allauth.account',  # registration
    'allauth.socialaccount',  # registration
    'tinymce',
    'sorl.thumbnail',
    # 'newsletter',
    #'envelope',
    'cities_light',
    'django_filters',
    'haystack',
    'terms',
    # wagtail apps
    'compressor',
    'taggit',
    'modelcluster',
    'wagtail.core',
    'wagtail.admin',
    'wagtail.documents',
    'wagtail.snippets',
    'wagtail.users',
    'wagtail.images',
    'wagtail.embeds',
    'wagtail.search',
    'wagtail.contrib.forms',
    'wagtail.contrib.redirects',
    'wagtail.contrib.sitemaps',
    'wagtail.contrib.settings',
    'wagtail.contrib.modeladmin',
    'wagtail.sites', #added in wagtail v0.7...required in v2.0
    'wagtailnews',
    'wagtail.contrib.routable_page',
    # end wagtail apps
    'robots',
    'simplejson',
    'django_extensions'
)

# Apps specific for this project go here.
LOCAL_APPS = (
    # custom users app
    'users',  #.apps.UsersConfig',
    # Your stuff: custom apps go here
    'artefacts',  # custom artefacts app
    'contacts',
    'documents',
    'stratigraphies',
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# MIDDLEWARE CONFIGURATION
# ------------------------------------------------------------------------------
MIDDLEWARE = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.contrib.sites.middleware.CurrentSiteMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'wagtail.core.middleware.SiteMiddleware',
    'wagtail.contrib.redirects.middleware.RedirectMiddleware',
    'micorr.artefacts.middlewares.artefactAccessControlMiddleware',
)

# MIGRATIONS CONFIGURATION
# ------------------------------------------------------------------------------
MIGRATION_MODULES = {
    #'sites': 'micorr.contrib.sites.migrations'
}

# DEBUG
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool('DJANGO_DEBUG', False)

# FIXTURE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-FIXTURE_DIRS
FIXTURE_DIRS = (
    str(APPS_DIR.path('fixtures')),
)

# EMAIL CONFIGURATION
# ------------------------------------------------------------------------------
EMAIL_BACKEND = env('DJANGO_EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')

# MANAGER CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = (
    ('MiCorr', 'micorr@he-arc.ch'),
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS

# DATABASE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    # Raises ImproperlyConfigured exception if DATABASE_URL not in os.environ
    'default': env.db('DATABASE_URL', default='postgres://micorr@postgres:5432/micorr'),
}
DATABASES['default']['ATOMIC_REQUESTS'] = True


# GENERAL CONFIGURATION
# ------------------------------------------------------------------------------
# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/Zurich'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = 'en-us'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1

WAGTAIL_SITE_NAME = 'MiCorr'

# the new richtext editor in wagtail v2.0 (Draftail) is incompatible with image as link in content
# https://docs.wagtail.io/en/stable/releases/2.0.html?highlight=draftail#hallo-js-customisations-are-unavailable-on-the-draftail-rich-text-editor
# this breaks the editor (while page is still published fine)
# open wagtail issue https://github.com/wagtail/wagtail/issues/4602 as of today
# we depend on this for several pages for now (e.g. http://127.0.0.1:8000/w/admin/pages/29/edit/, http://127.0.0.1:8000/w/admin/pages/21/edit/ )
# so we revert to previous editor Hallojs

WAGTAILADMIN_RICH_TEXT_EDITORS = {
    'default': {
        'WIDGET': 'wagtail.admin.rich_text.HalloRichTextArea'
    }
}

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True

# TEMPLATE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        'DIRS': [
            str(APPS_DIR.path('templates')),
        ],
        'OPTIONS': {
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
            'debug': DEBUG,
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                #'allauth.account.context_processors.account',
                #'allauth.socialaccount.context_processors.socialaccount',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                # Your stuff: custom template context processors go here
                'dealer.contrib.django.context_processor',
            ],
        },
    },
]

# See: http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = 'bootstrap3'

# STATIC FILE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = str(ROOT_DIR('staticfiles'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = (
    str(APPS_DIR.path('static')),
)

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# MEDIA CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(APPS_DIR('media'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = '/media/'

# URL Configuration
# ------------------------------------------------------------------------------
ROOT_URLCONF = 'config.urls'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = 'config.wsgi.application'

# AUTHENTICATION CONFIGURATION
# ------------------------------------------------------------------------------
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

# Some really nice defaults
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

ACCOUNT_ALLOW_REGISTRATION = env.bool('DJANGO_ACCOUNT_ALLOW_REGISTRATION', True)
ACCOUNT_ADAPTER = 'micorr.users.adapters.AccountAdapter'
SOCIALACCOUNT_ADAPTER = 'micorr.users.adapters.SocialAccountAdapter'

# Custom user app defaults
# Select the correct user model
AUTH_USER_MODEL = 'users.User'
LOGIN_REDIRECT_URL = 'users:redirect'
LOGIN_URL = 'account_login'

# SLUGLIFIER
AUTOSLUG_SLUGIFY_FUNCTION = 'slugify.slugify'


# django-compressor
# ------------------------------------------------------------------------------


# Location of root django.contrib.admin URL, use {% url 'admin:index' %}
ADMIN_URL = 'admin/'


# Your common stuff: Below this line define 3rd party library settings
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch2_backend.Elasticsearch2SearchEngine',
        'URL': 'http://elasticsearch:9200/',
        'INDEX_NAME': 'haystack',
        #'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
    },
}
# cause haystack/elasticsearch index to be updated in realtime (inside request/response cycle) on indexed model save/delete
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

NODE_BASE_URL = env('NODE_BASE_URL', default='http://node:8080/')

NEO4J_AUTH = env('NEO4J_AUTH', default='neo4j:secret') #no default provided as it must be set in environment variable for direct use by py2neo
NEO4J_HOST = env('NEO4J_HOST', default='neo4j')
NEO4J_PROTOCOL = env('NEO4J_PROTOCOL', default='bolt')

NOTEBOOK_ARGUMENTS = [ '--notebook-dir', 'notebooks']

# Terms template filter settings
TERMS_ENABLED = False
TERMS_REPLACE_FIRST_ONLY = False

#DJANGO_TINYMCE
# see http://django-tinymce.readthedocs.io/en/latest/installation.html#configuration
# and https://www.tinymce.com/docs/configure/integration-and-setup/
TINYMCE_JS_URL = os.path.join(STATIC_URL, "js/tinymce/tinymce.min.js")
TINYMCE_DEFAULT_CONFIG = {"theme": "modern", "relative_urls": False, "statusbar": False, "plugins": "table autoresize",
                          "menubar":"file edit insert view format table tools help",
                          "autoresize_min_height":100, "autoresize_max_height": 500, "autoresize_bottom_margin":10, "autoresize_on_init":True }
TINYMCE_COMPRESSOR = False
TINYMCE_JS_ROOT = os.path.join(STATIC_URL, "js/tinymce")

# django-avatar settings
# default image generated when  there no local avatar image nor gravatar image associated with user's email
# https://en.gravatar.com/site/implement/images/#default-image
AVATAR_GRAVATAR_DEFAULT = 'retro'  # mp, identicon, monsterid, wavatar, retro, robohash, blank
AVATAR_AUTO_GENERATE_SIZES = [80, 35]
# settings AVATAR_THUMB_FORMAT to PNG actually fixes no resize issue with png upload and still allows jpg
# see https://github.com/grantmcconnaughey/django-avatar/issues/153 and comment in https://github.com/grantmcconnaughey/django-avatar/pull/180
AVATAR_THUMB_FORMAT = "PNG"
