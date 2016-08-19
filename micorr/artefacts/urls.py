from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import ArtefactsListView, ArtefactsDetailView, ArtefactsUpdateView, ArtefactsDeleteView, \
    ArtefactsCreateView, DocumentUpdateView, DocumentDeleteView, DocumentCreateView, \
    ChronologyCreateView, AlloyCreateView, EnvironmentCreateView, TechnologyCreateView, \
    MicrostructureCreateView, MetalCreateView, CorrosionFormCreateView, CorrosionTypeCreateView, searchStratigraphy

urlpatterns = patterns('',
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),

    url(r'^(?P<pk>\d+)/update/$', login_required(ArtefactsUpdateView.as_view()),
       name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', login_required(ArtefactsDeleteView.as_view()),
       name='artefact-delete'),
    url(r'^create/$', login_required(ArtefactsCreateView.as_view()), name='artefact-create'),

    url(r'^add/origin/?$', 'artefacts.views.newOrigin'),
    url(r'^add/author/?$', 'artefacts.views.newAuthor'),
    url(r'^add/recovering_date/?$', 'artefacts.views.newRecoveringDate'),
    url(r'^add/chronology_period/?$', 'artefacts.views.newChronologyPeriod'),
    url(r'^add/environment/?$', 'artefacts.views.newEnvironment'),
    url(r'^add/location/?$', 'artefacts.views.newLocation'),
    url(r'^add/owner/?$', 'artefacts.views.newOwner'),
    url(r'^add/alloy/?$', 'artefacts.views.newAlloy'),
    url(r'^add/technology/?$', 'artefacts.views.newTechnology'),
    url(r'^add/sample_location/?$', 'artefacts.views.newSampleLocation'),
    url(r'^add/responsible_institution/?$', 'artefacts.views.newResponsibleInstitution'),
    url(r'^add/microstructure/?$', 'artefacts.views.newMicrostructure'),
    url(r'^add/metal1/?$', 'artefacts.views.newMetal1'),
    url(r'^add/metalx/?$', 'artefacts.views.newMetalX'),
    url(r'^add/corrosion_form/?$', 'artefacts.views.newCorrosionForm'),
    url(r'^add/corrosion_type/?$', 'artefacts.views.newCorrosionType'),

    url(r'^create/chronology/$', login_required(ChronologyCreateView.as_view()), name='chronology-create'),
    url(r'^create/alloy/$', login_required(AlloyCreateView.as_view()), name='alloy-create'),
    url(r'^create/technology/$', login_required(TechnologyCreateView.as_view()), name='technology-create'),
    url(r'^create/environment/$', login_required(EnvironmentCreateView.as_view()), name='environment-create'),
    url(r'^create/microstructure/$', login_required(MicrostructureCreateView.as_view()), name='microstructure-create'),
    url(r'^create/metal/$', login_required(MetalCreateView.as_view()), name='metal-create'),
    url(r'^create/corrosionform/$', login_required(CorrosionFormCreateView.as_view()), name='corrosionform-create'),
    url(r'^create/corrosiontype/$', login_required(CorrosionTypeCreateView.as_view()), name='corrosiontype-create'),

    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/update/$', login_required(DocumentUpdateView.as_view()),
       name='document-update'),
    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/delete/$',
       login_required(DocumentDeleteView.as_view()), name='document-delete'),
    url(r'^(?P<artefact_id>\d+)/document/create/$', login_required(DocumentCreateView.as_view()),
       name='document-create'),
    url(r'^stratigraphy/$', searchStratigraphy, name='searchStratigraphy'),

    #url(r'^test-ontology/$', displayOntology),
)
