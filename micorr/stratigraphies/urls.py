from django.conf.urls import url
from stratigraphies import views as stratigraphies_views
from stratigraphies.views import ShareCreateView, ShareListView, ShareDeleteView

app_name = "stratigraphies"

urlpatterns = [
    url(r'^$', stratigraphies_views.home, name='list'),
    url(r'^json/isauthenticated', stratigraphies_views.isauthenticated),
    url(r'^json/getallartefacts$', stratigraphies_views.getallartefacts),
    url(r'^json/getallcharacteristic$', stratigraphies_views.getallcharacteristic),
    url(r'^json/getstratsbyartefact/(?P<artefact>\w+)$', stratigraphies_views.getStratigraphyByArtefact),
    url(r'^json/getstratigraphydetails/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.getStratigraphyDetails),
    url(r'^json/stratigraphyexists/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.stratigraphyExists),
    url(r'^json/addstratigraphy/(?P<artefact>\w+)/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.addStratigraphy),
    url(r'^json/addartefact/(?P<artefact>\w+)$', stratigraphies_views.addArtefact),
    #url(r'^json/save/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', stratigraphies_views.views.save),
    url(r'^json/save$', stratigraphies_views.save),
    #url(r'^json/match/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', stratigraphies_views.views.match),
    url(r'^json/match$', stratigraphies_views.match),
    url(r'^json/deleteStratigraphy/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.deleteStratigraphy),
    url(r'^json/deleteartefact/(?P<artefact>\w+)$', stratigraphies_views.deleteArtefact),
    url(r'^json/getnaturefamily/(?P<nature>\w+)$', stratigraphies_views.getnaturefamily),
    url(r'^update-description/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.update_stratigraphy_description, name='update-description'),
    url(r'^delete-user/(?P<stratigraphy>[\w-]+)$', stratigraphies_views.delete_stratigraphy_user, name='delete-user'),
    url(r'^email$', stratigraphies_views.sendEmail, name='send_email'),
    url(r'^node_descriptions$', stratigraphies_views.node_descriptions, name='node_descriptions'),
    url(r'^(?P<stratigraphy>[\w-]+)/create/share$', ShareCreateView.as_view(), name='create-share'),
    url(r'^(?P<stratigraphy>[\w-]+)/delete/share/(?P<user_id>\d+)$', ShareDeleteView.as_view(), name='delete-share'),
    url(r'^(?P<stratigraphy>[\w-]+)/list/shares$', ShareListView.as_view(), name='list-share')
]

