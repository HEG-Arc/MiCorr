from django.conf.urls import patterns, url

from artefacts import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^(?P<artefact_id>\d+)/$', views.detail, name='detail'),
)
