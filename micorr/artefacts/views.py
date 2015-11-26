from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import get_object_or_404, render
from django.views import generic
from haystack.forms import SearchForm
from django.http import HttpResponse

import rdflib
from SPARQLWrapper import SPARQLWrapper, JSON

from .models import Artefact, Document, Origin, ChronologyPeriod, Alloy, Technology
from .forms import ArtefactsUpdateForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter,\
    OriginCreateForm, ChronologyCreateForm, AlloyCreateForm, TechnologyCreateForm


def displayOntology(request):

    sparql = SPARQLWrapper("http://micorr-dev.ig.he-arc.ch:3030/ds/query")

    #-------------------
    #USING SPARQLWrapper
    #-----------------

    # Querying the ontology
    sparql.setQuery("""
        SELECT ?x ?fname
        WHERE {?x  <http://micorr.ig.he-arc.ch/vocab#artefacts_alloy_name>  ?fname}
        """)
    sparql.setReturnFormat(JSON)
    results = sparql.query()

    # Convert the results to a dictionary
    dict = results.convert()

    listResultsWrapper = []

    # Loop through the results
    for result in dict["results"]["bindings"]:
        listResultsWrapper.append(result["fname"]["value"])

    #-----------------
    #USING SPARQLStore
    #-----------------

    g = rdflib.ConjunctiveGraph('SPARQLStore')
    g.open("http://micorr-dev.ig.he-arc.ch:3030/ds/query")

    #Querying the ontology
    qres = g.query("""
        SELECT ?x ?fname
        WHERE {?x  <http://micorr.ig.he-arc.ch/vocab#artefacts_alloy_name>  ?fname}
        """)

    listResultsStore = []

    # Loop through the results
    for row in qres:
        listResultsStore.append(row.fname)

    return render(request, "artefacts/artefact_ontology_answer.html", locals())

class ArtefactsListView(generic.ListView):
    """
    A list of all the artefacts in the filter
    """
    queryset = Artefact.objects.select_related('alloy', 'type', 'chronology_period', 'technology',
                                               'microstructure')

    def get(self, request, *args, **kwargs):
        """
        Applies a filter to the artefacts list
        The user can make a full text search and/or a filter-based search
        """
        artefactssearch = SearchForm(request.GET)
        artefactsfilter = ArtefactFilter(request.GET)
        searchresults = artefactssearch.search()
        filtered_artefacts_list = []
        if request.GET.get('q'):
            for artefact in searchresults:
                if artefact.object in artefactsfilter:
                    filtered_artefacts_list.append(artefact.object)
        else:
            for artefact in artefactsfilter:
                filtered_artefacts_list.append(artefact)
        return render(request, "artefacts/artefact_list.html",
                      {'search': artefactssearch, 'results': filtered_artefacts_list, 'filter': artefactsfilter,
                       'self': self})

class ArtefactsDetailView(generic.DetailView):
    """
    A detail view of a selected artefact
    """
    queryset = Artefact.objects.select_related('alloy', 'type', 'origin', 'recovering_date', 'chronology_period',
                                               'environment', 'location', 'owner', 'technology', 'sample_location',
                                               'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type')

    def get_context_data(self, **kwargs):
        """
        Allows the template to use the selected artefact as well as its foreign keys pointers
        """
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
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('pk', None)}, )


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


class OriginCreateView(generic.CreateView):
    """
    A view which allows the user to create an origin
    When the chronology is created, it redirects the user to the artefact list
    """
    model = Origin
    template_name_suffix = '_create_form'
    form_class = OriginCreateForm


class ChronologyCreateView(generic.CreateView):
    """
    A view which allows the user to create a chronology
    When the chronology is created, it redirects the user to the artefact list
    """
    model = ChronologyPeriod
    template_name_suffix = '_create_form'
    form_class = ChronologyCreateForm


class AlloyCreateView(generic.CreateView):
    """
    A view which allows the user to create an alloy
    When the chronology is created, it redirects the user to the artefact list
    """
    model = Alloy
    template_name_suffix = '_create_form'
    form_class = AlloyCreateForm
    success_url = reverse_lazy('artefacts:artefact-list')


class TechnologyCreateView(generic.CreateView):
    """
    A view which allows the user to create a technology
    When the chronology is created, it redirects the user to the artefact list
    """
    model = Technology
    template_name_suffix = '_create_form'
    form_class = TechnologyCreateForm


class DocumentUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit a document
    When the editing is finished, it redirects the user to the related artefact detail page
    """
    model = Document
    template_name_suffix = '_update_form'
    form_class = DocumentUpdateForm

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('artefact_id', None)}, )


class DocumentDeleteView(generic.DeleteView):
    """
    A view which allows the user to delete a document
    When the document is deleted, it redirects the user to the related artefact detail page
    """
    model = Document
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('artefact_id', None)}, )


class DocumentCreateView(generic.CreateView):
    """
    A view which allows the user to create a document
    When the document is created, it redirects the user to the related artefact detail page
    """
    model = Document
    template_name_suffix = '_create_form'
    form_class = DocumentCreateForm

    def get_context_data(self, **kwargs):
        """
        Allows the template to use the selected artefact
        """
        context = super(DocumentCreateView, self).get_context_data(**kwargs)
        artefact = get_object_or_404(Artefact, pk=self.kwargs['artefact_id'])
        context['artefact'] = artefact
        return context

    def form_valid(self, form):
        """
        Add the selected artefact as the document foreign key
        """
        artefact = get_object_or_404(Artefact, pk=self.kwargs['artefact_id'])
        form.instance.artefact = artefact
        return super(DocumentCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:artefact-detail', kwargs={'pk': self.kwargs.get('artefact_id', None)}, )


"""
class GenericCreateView(generic.CreateView):

    Allows the user to add an instance of an artefact foreign key model when adding an artefact

    template_name = 'foreignkeys_update_form'

    all_models_dict = {
        "role_list" : Metal.objects.all(),
        "venue_list": Venue.objects.all(),
                           #and so on for all the desired models...

    }
"""
