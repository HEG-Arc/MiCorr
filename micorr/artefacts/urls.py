from django.conf.urls import patterns, url

from .views import ArtefactsListView, ArtefactsDetailView, ArtefactsUpdateView, ArtefactsDeleteView

urlpatterns = patterns('',
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),
    url(r'^(?P<pk>\d+)/update/$', ArtefactsUpdateView.as_view(), name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', ArtefactsDeleteView.as_view(), name='artefact-delete'),
)