from django.conf.urls import patterns, url

from subjects import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^(?P<subject_id>\d+)/$', views.detail, name='detail'),
)