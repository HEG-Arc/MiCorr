from django.shortcuts import get_object_or_404, render
from .models import Artefact


def index(request):
    artefacts_list = Artefact.objects.all()
    return render(request, 'artefacts/index.html', {'artefact_list': artefacts_list})


def detail(request, subject_id):
    artefact = get_object_or_404(Artefact, pk=subject_id)
    return render(request, 'artefacts/detail.html', {'artefact': artefact})
