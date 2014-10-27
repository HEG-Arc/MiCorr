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

    def get_context_data(self, **kwargs):
        context = super(ArtefactsDetailView, self).get_context_data(**kwargs)
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        sections = artefact.section_set.all()
        context['artefact'] = artefact
        context['sections'] = sections
        return context


class ArtefactFilterSet(FilterSet):
    fields = [
        'inventory_number',
        'metal',
    ]
