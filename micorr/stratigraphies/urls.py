from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^$', 'stratigraphies.views.home', name='list'),
    url(r'^test$', 'stratigraphies.views.test'),
    url(r'^json/getallartefacts$', 'stratigraphies.views.getallartefacts'),
    url(r'^json/getallcharacteristic$', 'stratigraphies.views.getallcharacteristic'),
    url(r'^json/getstratsbyartefact/(?P<artefact>\w+)$', 'stratigraphies.views.getStratigraphyByArtefact'),
    url(r'^json/getstratigraphydetails/(?P<stratigraphy>[\w-]+)/$', 'stratigraphies.views.getStratigraphyDetails'),
    url(r'^json/stratigraphyexists/(?P<stratigraphy>[\w-]+)/$', 'stratigraphies.views.stratigraphyExists'),
    url(r'^json/addstratigraphy/(?P<artefact>\w+)/(?P<stratigraphy>[\w-]+)/$', 'stratigraphies.views.addStratigraphy'),
    url(r'^json/addartefact/(?P<artefact>\w+)$', 'stratigraphies.views.addArtefact'),
    url(r'^json/save/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', 'stratigraphies.views.save'),
    url(r'^json/match/(?P<data>[[a-zA-Z0-9%-\{\}\[\]\'\"\:\,\ \_]{0,}]{0,})$', 'stratigraphies.views.match'),
    url(r'^json/deleteStratigraphy/(?P<stratigraphy>[\w-]+)/$', 'stratigraphies.views.deleteStratigraphy'),
    url(r'^json/deleteartefact/(?P<artefact>\w+)$', 'stratigraphies.views.deleteArtefact'),
    url(r'^json/getnaturefamily/(?P<nature>\w+)$', 'stratigraphies.views.getnaturefamily'),
    url(r'^update-description/(?P<stratigraphy>[\w-]+)/$', 'stratigraphies.views.update_stratigraphy_description', name='update-description'),
)
