from django.conf.urls import patterns, url

from .views import ArtefactsListView, ArtefactsDetailView

urlpatterns = patterns('',
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),
)