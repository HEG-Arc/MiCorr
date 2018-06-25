from django.conf.urls import  url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from artefacts import views as artefacts_views

app_name="artefacts"

urlpatterns = [
    url(r'^$', artefacts_views.ArtefactsListView.as_view(), name='artefact-list'),
    url(r'^(?P<pk>\d+)/$', artefacts_views.ArtefactsDetailView.as_view(), name='artefact-detail'),

    url(r'^(?P<pk>\d+)/update/$', login_required(artefacts_views.ArtefactsUpdateView.as_view()),
       name='artefact-update'),
    url(r'^(?P<pk>\d+)/delete/$', login_required(artefacts_views.ArtefactsDeleteView.as_view()),
       name='artefact-delete'),
    url(r'^(?P<pk>\d+)/delete/(?P<object_id>\d+)/$', login_required(artefacts_views.ArtefactsDeleteView.as_view()),
       name='artefact-object-delete'),
    url(r'^create/$', login_required(artefacts_views.ObjectCreateView.as_view()), name='object-create'),


    url(r'^add/author/?$', artefacts_views.newAuthor),
    url(r'^add/type/?$', artefacts_views.newType),
    url(r'^add/origin/?$', artefacts_views.newOrigin),
    url(r'^add/recovering_date/?$', artefacts_views.newRecoveringDate),
    url(r'^add/chronology_period/?$', artefacts_views.newChronologyPeriod),
    url(r'^add/environment/?$', artefacts_views.newEnvironment),
    url(r'^add/location/?$', artefacts_views.newLocation),
    url(r'^add/owner/?$', artefacts_views.newOwner),
    url(r'^add/alloy/?$', artefacts_views.newAlloy),
    url(r'^add/technology/?$', artefacts_views.newTechnology),
    url(r'^add/sample_location/?$', artefacts_views.newSampleLocation),
    url(r'^add/responsible_institution/?$', artefacts_views.newResponsibleInstitution),
    url(r'^add/microstructure/?$', artefacts_views.newMicrostructure),
    url(r'^add/metal1/?$', artefacts_views.newMetal1),
    url(r'^add/metalx/?$', artefacts_views.newMetalX),
    url(r'^add/corrosion_form/?$', artefacts_views.newCorrosionForm),
    url(r'^add/corrosion_type/?$', artefacts_views.newCorrosionType),

    url(r'^(?P<section_id>\d+)/create/image/$', login_required(artefacts_views.ImageCreateView.as_view()), name='image-create'),
    url(r'^(?P<section_id>\d+)/update/image/(?P<pk>\d+)/$', login_required(artefacts_views.ImageUpdateView.as_view()), name='image-update'),
    url(r'^(?P<section_id>\d+)/refresh/image/$', TemplateView.as_view(template_name='artefacts/refresh.html'), name='image-refresh'),
    url(r'^(?P<section_id>\d+)/refresh/div/$', artefacts_views.RefreshDivView, name='div-refresh'),
    url(r'^image/(?P<pk>\d+)/delete/$', login_required(artefacts_views.ImageDeleteView.as_view()), name='image-delete'),
    url(r'^(?P<section_id>\d+)/list/stratigraphy/$', artefacts_views.StratigraphyListView, name='stratigraphy-list'),
    url(r'^(?P<section_id>\d+)/add/stratigraphy/(?P<stratigraphy_uid>[\w\-]+)/$',artefacts_views.StratigraphyAddView, name='add-stratigraphy'),
    url(r'^(?P<section_id>\d+)/update/stratigraphy/(?P<pk>[\w\-]+)/$',login_required(artefacts_views.StratigraphyUpdateView.as_view()),name='stratigraphy-update'),
    url(r'^(?P<section_id>\d+)/refresh/stratigraphy/$', TemplateView.as_view(template_name='artefacts/strat-refresh.html'), name='strat-refresh'),
    url(r'^(?P<section_id>\d+)/refresh/strat-div/$', artefacts_views.RefreshStratDivView, name='strat-div-refresh'),
    url(r'^stratigraphy/(?P<pk>\d+)/delete/$', login_required(artefacts_views.StratigraphyDeleteView.as_view()), name='stratigraphy-delete'),

    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/update/$', login_required(artefacts_views.DocumentUpdateView.as_view()),
       name='document-update'),
    url(r'^(?P<artefact_id>\d+)/document/(?P<pk>\d+)/delete/$',
       login_required(artefacts_views.DocumentDeleteView.as_view()), name='document-delete'),
    url(r'^(?P<artefact_id>\d+)/document/create/$', login_required(artefacts_views.DocumentCreateView.as_view()),
       name='document-create'),
    url(r'^stratigraphy/$', artefacts_views.searchStratigraphy, name='searchStratigraphy'),

    url(r'^(?P<artefact_id>\d+)/contact_author/', artefacts_views.contactAuthor, name='contact_author'),
    url(r'^(?P<artefact_id>\d+)/share/', artefacts_views.shareArtefact, name='share_artefact'),
    url(r'^(?P<artefact_id>\d+)/share_with_a_friend/', artefacts_views.shareArtefactWithFriend, name='share_artefact_with_friend'),

    url(r'^(?P<artefact_id>\d+)/tokens/$', login_required(artefacts_views.listToken), name='list_tokens'),
    url(r'^(?P<artefact_id>\d+)/token/(?P<pk>\d+)/delete/$',
        login_required(artefacts_views.TokenDeleteView.as_view()), name='delete_token'),

    url(r'^collaboration/$', login_required(artefacts_views.CollaborationListView.as_view()), name='collaboration_menu'),
    url(r'^collaboration/deleted/$', login_required(artefacts_views.CollaborationDeletedListView.as_view()), name='collaboration_deleted_menu'),
    url(r'^(?P<token_id>\d+)/collaboration/update/$', login_required(artefacts_views.CollaborationUpdateView.as_view()), name='collaboration-update'),
    url(r'^(?P<pk>\d+)/collaboration/comment/(?P<field>\w+)/$', login_required(artefacts_views.CollaborationCommentView.as_view()), name='collaboration-comment'),
    url(r'^(?P<pk>\d+)/collaboration/hide/$', login_required(artefacts_views.CollaborationHideView.as_view()), name='collaboration-hide'),
    url(r'^(?P<token_id>\d+)/collaboration/retrieve/$', login_required(artefacts_views.retrieveDeletedCollaboration), name='collaboration-retrieve'),

    url(r'^(?P<token_id>\d+)/collaboration/send/$', login_required(artefacts_views.sendComments), name='send-comments'),
    url(r'^(?P<pk>\d+)/collaboration/read/$', login_required(artefacts_views.CommentReadView.as_view()), name='read-comments'),
    url(r'^collaboration/(?P<pk>\d+)/delete/(?P<token_id>\d+)/$', login_required(artefacts_views.CommentDeleteView.as_view()), name='delete-comment-without-relation'),
    url(r'^collaboration/(?P<pk>\d+)/delete/(?P<token_id>\d+)/(?P<child_id>\d+)/$', login_required(artefacts_views.CommentDeleteView.as_view()), name='delete-comment-without-parent'),
    url(r'^collaboration/(?P<pk>\d+)/delete/(?P<token_id>\d+)/(?P<parent_id>\d+)/(?P<child_id>\d+)/$', login_required(artefacts_views.CommentDeleteView.as_view()), name='delete-comment'),

    url(r'^publication/$', login_required(artefacts_views.PublicationListView.as_view()), name='publication-menu'),
    url(r'^publication/create/(?P<pk>\d+)/$', login_required(artefacts_views.PublicationCreateView.as_view()), name='publication-create'),
    url(r'^publication/(?P<pk>\d+)/$', login_required(artefacts_views.PublicationArtefactDetailView.as_view()), name='publication-artefact-detail'),
    url(r'^administration/$', login_required(artefacts_views.AdministrationListView.as_view()), name='publication-administration-menu'),
    url(r'^administration/(?P<pk>\d+)/(?P<accessType>\w+)/$', login_required(artefacts_views.AdministrationArtefactDetailView.as_view()), name='publication-administration-detail'),
    url(r'^administration/decision/(?P<pk>\d+)/$', login_required(artefacts_views.PublicationUpdateDecision.as_view()), name='publication-administration-decision'),
    url(r'^administration/confirm/(?P<publication_id>\d+)/$', login_required(artefacts_views.confirmDecisionDelegatedAdmin), name='publication-administration-confirm'),
    url(r'^administration/reject/(?P<pk>\d+)/$', login_required(artefacts_views.PublicationDecisionReject.as_view()), name='publication-administration-reject'),
    url(r'^administration/delegate/(?P<pk>\d+)/$', login_required(artefacts_views.PublicationDelegateView.as_view()), name='publication-administration-delegate'),
    url(r'^city-autocomplete/$', artefacts_views.CityAutocomplete.as_view(), name='city-autocomplete'),
    url(r'^region-autocomplete/$', artefacts_views.RegionAutocomplete.as_view(), name='region-autocomplete'),
    url(r'^country-autocomplete/$', artefacts_views.CountryAutocomplete.as_view(), name='country-autocomplete'),
    url(r'^generic-autocomplete/(?P<model>[\w-]+)/$', artefacts_views.GenericAutoComplete.as_view(create_field='name'), name='generic-autocomplete'),
    url(r'^date-autocomplete/(?P<model>[\w-]+)/$', artefacts_views.GenericAutoComplete.as_view(create_field='date'), name='date-autocomplete'),
    url(r'^type-autocomplete/(?P<model>[\w-]+)/$', artefacts_views.GenericAutoComplete.as_view(create_field='type'), name='type-autocomplete'),
    url(r'^form-autocomplete/(?P<model>[\w-]+)/$', artefacts_views.GenericAutoComplete.as_view(create_field='form'), name='form-autocomplete'),
    url(r'^element-autocomplete/(?P<model>[\w-]+)/$', artefacts_views.GenericAutoComplete.as_view(create_field='element'), name='element-autocomplete'),
    # url(r'^test-ontology/$', displayOntology),
]
