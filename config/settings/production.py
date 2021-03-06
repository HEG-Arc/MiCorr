# -*- coding: utf-8 -*-
"""
Production Configurations

- Use djangosecure
- Use Redis
- Use sentry for error logging


"""


import logging
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration



from .common import *  # noqa

# SECRET CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
# Raises ImproperlyConfigured exception if DJANGO_SECRET_KEY not in os.environ
SECRET_KEY = env('DJANGO_SECRET_KEY')


# This ensures that Django will be able to detect a secure connection
# properly on Heroku.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Use Whitenoise to serve static files
# See: https://whitenoise.readthedocs.io/

# insert whitenoise middleware after SecurityMiddleware
# (see http://whitenoise.evans.io/en/stable/#quickstart-for-django-apps)
middleware_list = list(MIDDLEWARE)
middleware_list.insert(1 + MIDDLEWARE.index('django.middleware.security.SecurityMiddleware'),
                       'whitenoise.middleware.WhiteNoiseMiddleware')
MIDDLEWARE = tuple(middleware_list)


# SECURITY CONFIGURATION
# ------------------------------------------------------------------------------
# See https://docs.djangoproject.com/en/1.9/ref/middleware/#module-django.middleware.security
# and https://docs.djangoproject.com/ja/1.9/howto/deployment/checklist/#run-manage-py-check-deploy

# set this to 60 seconds and then to 518400 when you can prove it works
SECURE_HSTS_SECONDS = 60
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
    'DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS', default=True)
SECURE_CONTENT_TYPE_NOSNIFF = env.bool(
    'DJANGO_SECURE_CONTENT_TYPE_NOSNIFF', default=True)
SECURE_BROWSER_XSS_FILTER = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SECURE_SSL_REDIRECT = env.bool('DJANGO_SECURE_SSL_REDIRECT', default=True)
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'DENY'

# SITE CONFIGURATION
# ------------------------------------------------------------------------------
# Hosts/domain names that are valid for this site
# See https://docs.djangoproject.com/en/1.6/ref/settings/#allowed-hosts
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['micorr.org', 'dev.micorr.org'])
# END SITE CONFIGURATION

INSTALLED_APPS += ('gunicorn', )


# STORAGE CONFIGURATION
# ------------------------------------------------------------------------------
# Static Assets
# ------------------------

#STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATICFILES_STORAGE = 'micorr.whitenoise.storage.ErrorSquashingStorage'

WHITENOISE_SKIP_COMPRESS_EXTENSIONS = ( # adds mp4 to default list of uncompressed files
'mp4', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'zip', 'gz', 'tgz', 'bz2', 'tbz', 'swf', 'flv', 'woff')

# EMAIL
# ------------------------------------------------------------------------------
DEFAULT_FROM_EMAIL = env('DJANGO_DEFAULT_FROM_EMAIL',
                         default='MiCorr <micorr@he-arc.ch>')
EMAIL_SUBJECT_PREFIX = env('DJANGO_EMAIL_SUBJECT_PREFIX', default='[MiCorr] ')
SERVER_EMAIL = env('DJANGO_SERVER_EMAIL', default=DEFAULT_FROM_EMAIL)
EMAIL_USE_TLS = True
EMAIL_HOST = env('DJANGO_EMAIL_HOST', default='smtprel.he-arc.ch')
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# TEMPLATE CONFIGURATION
# ------------------------------------------------------------------------------
# See:
# https://docs.djangoproject.com/en/dev/ref/templates/api/#django.template.loaders.cached.Loader
TEMPLATES[0]['OPTIONS']['loaders'] = [
    ('django.template.loaders.cached.Loader', [
        'django.template.loaders.filesystem.Loader', 'django.template.loaders.app_directories.Loader', ]),
]

# DATABASE CONFIGURATION
# ------------------------------------------------------------------------------
# Raises ImproperlyConfigured exception if DATABASE_URL not in os.environ
DATABASES['default'] = env.db('DATABASE_URL')

# CACHING
# ------------------------------------------------------------------------------
# Heroku URL does not pass the DB number, so we parse it in
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': '{0}/{1}'.format(env('REDIS_URL', default='redis://127.0.0.1:6379'), 0),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'IGNORE_EXCEPTIONS': True,  # mimics memcache behavior.
                                        # http://niwinz.github.io/django-redis/latest/#_memcached_exceptions_behavior
        }
    }
}


# Sentry Configuration
SENTRY_DSN = env('DJANGO_SENTRY_DSN')
APP_GIT_REV = env('APP_GIT_REV')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'root': {
        'level': 'WARNING',
        'handlers': ['console'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
       'django': {
            'level': 'INFO',
        },
        'django.security.DisallowedHost': {
            'level': 'ERROR',
        },
    },
}

sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True,
    release=APP_GIT_REV
)

# Custom Admin URL, use {% url 'admin:index' %}
ADMIN_URL = env('DJANGO_ADMIN_URL')


# Your production stuff: Below this line define 3rd party library settings
INSTALLED_APPS += ("deployment", )

DEALER_TYPE = 'env' # expect DEALER_TAG and DEALER_REVISION environment variables to be set in .env
