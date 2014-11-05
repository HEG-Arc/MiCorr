from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import get_object_or_404, render
from django.views import generic
from django_easyfilters import FilterSet

from .models import Artefact
from .forms import UpdateForm, CreateForm


class ArtefactsListView(generic.ListView):
    queryset = Artefact.objects.select_related('metal', 'origin', 'chronology_period')

    def get(self, request, *args, **kwargs):
        artefacts = Artefact.objects.all()
        artefactsfilter = ArtefactFilterSet(artefacts, request.GET)
        data = {
            'artefacts': artefactsfilter.qs,
            'artefactsfilter': artefactsfilter,
        }
        return render(request, "artefacts/artefact_list.html", data)


class ArtefactsDetailView(generic.DetailView):
    queryset = Artefact.objects.select_related('metal', 'type', 'origin', 'chronology_period', 'technology')

    def get_context_data(self, **kwargs):
        context = super(ArtefactsDetailView, self).get_context_data(**kwargs)
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        sections = artefact.section_set.all()
        context['artefact'] = artefact
        context['sections'] = sections
        return context


class ArtefactsUpdateView(generic.UpdateView):
    model = Artefact
    template_name_suffix = '_update_form'
    form_class = UpdateForm

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('pk', None)},)


class ArtefactsDeleteView(generic.DeleteView):
    model = Artefact
    template_name_suffix = '_confirm_delete'
    success_url = reverse_lazy('artefacts:artefact-list')


class ArtefactsCreateView(generic.CreateView):
    model = Artefact
    template_name_suffix = '_create_form'
    form_class = CreateForm
    success_url = reverse_lazy('artefacts:artefact-list')


class ArtefactFilterSet(FilterSet):
    fields = [
        'inventory_number',
        'metal',
    ]