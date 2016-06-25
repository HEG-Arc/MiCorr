from django.conf.urls import  url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from .views import ArtefactsListView, ArtefactsDetailView, ArtefactsUpdateView, ArtefactsDeleteView, \
    ArtefactsCreateView, DocumentUpdateView, DocumentDeleteView, DocumentCreateView, searchStratigraphy, \
    ImageCreateView, ImageDeleteView, StratigraphyDeleteView, ImageUpdateView

urlpatterns = [
    url(r'^$', ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', ArtefactsDetailView.as_view(), name='artefact-detail'),

    url(r'^(?P<pk>\d+)/update/$', login_required(ArtefactsUpdateView.as_view()),
       name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', login_required(ArtefactsDeleteView.as_view()),
       name='artefact-delete'),
    url(r'^create/$', login_required(ArtefactsCreateView.as_view()), name='artefact-create'),

    url(r'^add/author/?$', 'artefacts.views.newAuthor'),
    url(r'^add/type/?$', 'artefacts.views.newType'),
    url(r'^add/origin/?$', 'artefacts.views.newOrigin'),
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

    url(r'^(?P<section_id>\d+)/create/image/$', login_required(ImageCreateView.as_view()), name='image-create'),
    url(r'^(?P<section_id>\d+)/update/image/(?P<pk>\d+)/$', login_required(ImageUpdateView.as_view()), name='image-update'),
    url(r'^(?P<section_id>\d+)/refresh/image/$', TemplateView.as_view(template_name='artefacts/refresh.html'), name='image-refresh'),
    url(r'^(?P<section_id>\d+)/refresh/div/$', 'artefacts.views.RefreshDivView', name='div-refresh'),
    url(r'^image/(?P<pk>\d+)/delete/$', login_required(ImageDeleteView.as_view()), name='image-delete'),

    url(r'^(?P<artefact_id>\d+)/list/stratigraphy/$', 'artefacts.views.StratigraphyListView', name='stratigraphy-list'),
    url(r'^(?P<artefact_id>\d+)/add/stratigraphy/(?P<stratigraphy_uid>[\w\-]+)/$', 'artefacts.views.StratigraphyAddView', name='add-stratigraphy'),
    url(r'^(?P<artefact_id>\d+)/refresh/stratigraphy/$', TemplateView.as_view(template_name='artefacts/strat-refresh.html'), name='strat-refresh'),
    url(r'^(?P<artefact_id>\d+)/refresh/strat-div/$', 'artefacts.views.RefreshStratDivView', name='strat-div-refresh'),
    url(r'^stratigraphy/(?P<pk>\d+)/delete/$', login_required(StratigraphyDeleteView.as_view()), name='stratigraphy-delete'),

    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/update/$', login_required(DocumentUpdateView.as_view()),
       name='document-update'),
    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/delete/$',
       login_required(DocumentDeleteView.as_view()), name='document-delete'),
    url(r'^(?P<artefact_id>\d+)/document/create/$', login_required(DocumentCreateView.as_view()),
       name='document-create'),
    url(r'^stratigraphy/$', searchStratigraphy, name='searchStratigraphy'),

    #url(r'^test-ontology/$', displayOntology),
]
