from django.contrib.sitemaps import Sitemap
from artefacts.models import Artefact
from django.urls import reverse


class ArtefactSitemap(Sitemap):
    changefreq = 'daily'
    priority = 0.5

    def items(self):
        return Artefact.objects.all()

    def location(self, item):
        return reverse('artefacts:artefact-detail', kwargs={'pk': item.id})


class HomePageSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.5

    def items(self):
        return ['home']

    def location(self, item):
        return reverse(item)
