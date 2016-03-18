from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import ArtefactsListView, ArtefactsDetailView, ArtefactsUpdateView, ArtefactsDeleteView, \
    ArtefactsCreateView, DocumentUpdateView, DocumentDeleteView, DocumentCreateView, \
    OriginCreateView, ChronologyCreateView, AlloyCreateView, EnvironmentCreateView, TechnologyCreateView, \
    searchStratigraphy

urlpatterns = patterns('',
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),

    url(r'^(?P<pk>\d+)/update/$', login_required(ArtefactsUpdateView.as_view()),
       name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', login_required(ArtefactsDeleteView.as_view()),
       name='artefact-delete'),
    url(r'^create/$', login_required(ArtefactsCreateView.as_view()), name='artefact-create'),

    url(r'^create/origin/$', login_required(OriginCreateView.as_view()), name='origin-create'),
    url(r'^create/chronology/$', login_required(ChronologyCreateView.as_view()), name='chronology-create'),
    url(r'^create/alloy/$', login_required(AlloyCreateView.as_view()), name='alloy-create'),
    url(r'^create/technology/$', login_required(TechnologyCreateView.as_view()), name='technology-create'),
    url(r'^create/environment/$', login_required(EnvironmentCreateView.as_view()), name='environment-create'),

    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/update/$', login_required(DocumentUpdateView.as_view()),
       name='document-update'),
    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/delete/$',
       login_required(DocumentDeleteView.as_view()), name='document-delete'),
    url(r'^(?P<artefact_id>\d+)/document/create/$', login_required(DocumentCreateView.as_view()),
       name='document-create'),
    url(r'^stratigraphy/$', searchStratigraphy, name='searchStratigraphy'),

    #url(r'^test-ontology/$', displayOntology),
)
