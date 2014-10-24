from django.shortcuts import get_object_or_404, render
from django.views import generic
from django_easyfilters import FilterSet

from .models import Artefact


class ArtefactsListView(generic.ListView):
    queryset = Artefact.objects.select_related('metal', 'origin', 'chronology')

    def get(self, request, *args, **kwargs):
        artefacts = Artefact.objects.all()
        artefactsfilter = ArtefactFilterSet(artefacts, request.GET)
        data = {
            'artefacts': artefactsfilter.qs,
            'artefactsfilter': artefactsfilter,
        }
        return render(request, "artefacts/artefact_list.html", data)


class ArtefactsDetailView(generic.DetailView):
    queryset = Artefact.objects.select_related('metal', 'type', 'origin', 'chronology', 'technology')


class ArtefactFilterSet(FilterSet):
    fields = [
        'inventory_number',
        'metal',
    ]