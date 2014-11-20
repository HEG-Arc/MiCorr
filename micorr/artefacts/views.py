from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import get_object_or_404, render
from django.views import generic
import django_filters

from .models import Artefact, Document
from .forms import ArtefactsUpdateForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm


class ArtefactsListView(generic.ListView):
    """
    A list of all the artefacts in the filter
    """
    queryset = Artefact.objects.select_related('metal', 'origin', 'chronology_period')

    def get(self, request, *args, **kwargs):
        artefactsfilter = ArtefactFilter(request.GET)
        return render(request, "artefacts/artefact_list.html", {'filter': artefactsfilter})


class ArtefactsDetailView(generic.DetailView):
    """
    A detail view of an artefact
    """
    queryset = Artefact.objects.select_related('metal', 'type', 'origin', 'chronology_period', 'technology')

    def get_context_data(self, **kwargs):
        context = super(ArtefactsDetailView, self).get_context_data(**kwargs)
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        context['artefact'] = artefact
        context['sections'] = sections
        context['documents'] = documents
        return context


class ArtefactsUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit an artefact
    When the editing is finished, it redirects the user to the artefact detail page
    """
    model = Artefact
    template_name_suffix = '_update_form'
    form_class = ArtefactsUpdateForm

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('pk', None)},)


class ArtefactsDeleteView(generic.DeleteView):
    """
    A view which allows the user to delete an artefact
    When the artefact is deleted, it redirects the user to the artefact list
    """
    model = Artefact
    template_name_suffix = '_confirm_delete'
    success_url = reverse_lazy('artefacts:artefact-list')


class ArtefactsCreateView(generic.CreateView):
    """
    A view which allows the user to create an artefact
    When the artefact is created, it redirects the user to the artefact list
    """
    model = Artefact
    template_name_suffix = '_create_form'
    form_class = ArtefactsCreateForm
    success_url = reverse_lazy('artefacts:artefact-list')


class ArtefactFilter(django_filters.FilterSet):
    """
    A filter which appears on top of the artefacts list template and allows the user to search for artefacts using
    keywords and foreign keys
    """

    class Meta:
        model = Artefact
        fields = ['type', 'origin__city__country', 'chronology_period__chronology_category']


class DocumentUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit a document
    When the editing is finished, it redirects the user to the related artefact detail page
    """
    model = Document
    template_name_suffix = '_update_form'
    form_class = DocumentUpdateForm

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('artefact_id', None)},)


class DocumentDeleteView(generic.DeleteView):
    """
    A view which allows the user to delete a document
    When the document is deleted, it redirects the user to the related artefact detail page
    """
    model = Document
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('artefact_id', None)},)


class DocumentCreateView(generic.CreateView):
    """
    A view which allows the user to create a document
    When the document is created, it redirects the user to the artefacts list
    """
    model = Document
    template_name_suffix = '_create_form'
    form_class = DocumentCreateForm
    success_url = reverse_lazy('artefacts:artefact-list')