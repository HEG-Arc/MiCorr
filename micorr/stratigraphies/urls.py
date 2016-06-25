from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name='list'),
    url(r'^test$', views.test),
    url(r'^json/getallartefacts$', views.getallartefacts),
    url(r'^json/getallcharacteristic$', views.getallcharacteristic),
    url(r'^json/getstratsbyartefact/(?P<artefact>\w+)$', views.getStratigraphyByArtefact),
    url(r'^json/getstratigraphydetails/(?P<stratigraphy>[\w-]+)/$', views.getStratigraphyDetails),
    url(r'^json/stratigraphyexists/(?P<stratigraphy>[\w-]+)/$', views.stratigraphyExists),
    url(r'^json/addstratigraphy/(?P<artefact>\w+)/(?P<stratigraphy>[\w-]+)/$', views.addStratigraphy),
    url(r'^json/addartefact/(?P<artefact>\w+)$', views.addArtefact),
    #url(r'^json/save/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', 'stratigraphies.views.save'),
    url(r'^json/save$', views.save),
    url(r'^json/match/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', views.match),
    url(r'^json/deleteStratigraphy/(?P<stratigraphy>[\w-]+)/$', views.deleteStratigraphy),
    url(r'^json/deleteartefact/(?P<artefact>\w+)$', views.deleteArtefact),
    url(r'^json/getnaturefamily/(?P<nature>\w+)$', views.getnaturefamily),
    url(r'^update-description/(?P<stratigraphy>[\w-]+)/$', views.update_stratigraphy_description, name='update-description'),
    url(r'^delete-user/(?P<stratigraphy>[\w-]+)/$', views.delete_stratigraphy_user, name='delete-user'),
]
