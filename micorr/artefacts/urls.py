from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import ArtefactsListView, ArtefactsDetailView, ArtefactsUpdateView, ArtefactsDeleteView, ArtefactsCreateView

urlpatterns = patterns('',
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),
    url(r'^(?P<pk>\d+)/update/$', login_required(ArtefactsUpdateView.as_view()), name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', login_required(ArtefactsDeleteView.as_view()), name='artefact-delete'),
    url(r'^create/$', login_required(ArtefactsCreateView.as_view()), name='artefact-create'),
)