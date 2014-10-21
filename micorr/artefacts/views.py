from django.shortcuts import get_object_or_404, render
from django.views import generic

from .models import Artefact


def detail(request, artefact_id):
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    return render(request, 'artefacts/detail.html', {'artefact': artefact})


class ArtefactsListView(generic.ListView):

    model = Artefact


class ArtefactsDetailView(generic.DetailView):

    model = Artefact