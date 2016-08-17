from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import get_object_or_404, render, redirect
from django.views import generic
from haystack.forms import SearchForm
from django.http import HttpResponse
from stratigraphies.ch.neo4jDaoImpl.Neo4JDAO import Neo4jDAO

#import rdflib
#from SPARQLWrapper import SPARQLWrapper, JSON

from .models import Artefact, Document, Origin, ChronologyPeriod, Alloy, Technology, Environment, Microstructure, \
    Metal, CorrosionForm, CorrosionType, Section, SectionCategory
from .forms import ArtefactsUpdateForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter,\
    OriginCreateForm, ChronologyCreateForm, AlloyCreateForm, TechnologyCreateForm, EnvironmentCreateForm, \
    MicrostructureCreateForm, MetalCreateForm, CorrosionFormCreateForm, CorrosionTypeCreateForm

"""
def displayOntology(request):

    sparql = SPARQLWrapper("http://micorr-dev.ig.he-arc.ch:3030/ds/query")

    #-------------------
    #USING SPARQLWrapper
    #-----------------

    # Querying the ontology
    sparql.setQuery(""
        SELECT ?x ?fname
        WHERE {?x  <http://micorr.ig.he-arc.ch/vocab#artefacts_alloy_name>  ?fname}
        "")
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
    qres = g.query(""
        SELECT ?x ?fname
        WHERE {?x  <http://micorr.ig.he-arc.ch/vocab#artefacts_alloy_name>  ?fname}
        "")

    listResultsStore = []

    # Loop through the results
    for row in qres:
        listResultsStore.append(row.fname)

    return render(request, "artefacts/artefact_ontology_answer.html", locals())
"""


def searchStratigraphy(self):
    neo = Neo4jDAO()
    stratigraphy = Neo4jDAO.addStratigraphy(neo, "Search", "search")
    if stratigraphy:
        return redirect("/micorr/#/stratigraphy/" + stratigraphy)


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
        stratigraphies = artefact.stratigraphy_set.all()
        context['artefact'] = artefact
        context['sections'] = sections
        context['documents'] = documents
        context['stratigraphies'] = stratigraphies
        return context


class ArtefactsUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit an artefact
    When the editing is finished, it redirects the user to the artefact detail page
    """
    model = Artefact
    template_name_suffix = '_update_form'
    form_class = ArtefactsUpdateForm

    def get_object(self, queryset=None):
        obj = Artefact.objects.get(id=self.kwargs['pk'])
        return obj

    def get(self, request, **kwargs):
        artefact = Artefact.objects.get(id=self.kwargs['pk'])
        self.object = artefact
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        complementary_information = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='Description and visual observation')[0].complementary_information
        macroscopic_text = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Macroscopic observation')[0].content
        sample_complementary_information = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Sample')[0].complementary_information
        analyses_performed = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Analyses and results')[0].content
        metal_text = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Metal')[0].content
        metal_complementary_information = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Metal')[0].complementary_information
        corrosion_text = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Corrosion layers')[0].content
        corrosion_complementary_information = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Corrosion layers')[0].complementary_information
        synthesis_text = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0].content
        conclusion_text = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SectionCategory.objects.get(name='CO'), title='Conclusion')[0].content
        references_text = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SectionCategory.objects.get(name='RE'), title='References')[0].content
        return self.render_to_response(self.get_context_data(form=form, complementary_information=complementary_information, macroscopic_text=macroscopic_text, sample_complementary_information=sample_complementary_information, analyses_performed=analyses_performed, metal_text=metal_text, metal_complementary_information=metal_complementary_information, corrosion_text=corrosion_text, corrosion_complementary_information=corrosion_complementary_information, synthesis_text=synthesis_text, conclusion_text=conclusion_text, references_text=references_text))

    def post(self, request, *args, **kwargs):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        section_1 = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='The Object')[0]
        artefact.section_set.add(section_1)
        section_2 = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='Description and visual observation')[0]
        section_2.complementary_information = request.POST['complementary_information']
        artefact.section_set.add(section_2)
        section_3 = Section.objects.get_or_create(order=3, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        artefact.section_set.add(section_3)
        section_4 = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Macroscopic observation')[0]
        section_4.content = request.POST['macroscopic_text']
        artefact.section_set.add(section_4)
        section_5 = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Sample')[0]
        section_5.complementary_information = request.POST['sample_complementary_information']
        # images sample
        artefact.section_set.add(section_5)
        section_6 = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Analyses and results')[0]
        section_6.content = request.POST['analyses_performed']
        artefact.section_set.add(section_6)
        section_7 = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Metal')[0]
        section_7.content = request.POST['metal_text']
        section_7.complementary_information = request.POST['metal_complementary_information']
        # images metal
        artefact.section_set.add(section_7)
        section_8 = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Corrosion layers')[0]
        section_8.content = request.POST['corrosion_text']
        section_8.complementary_information = request.POST['corrosion_complementary_information']
        artefact.section_set.add(section_8)
        section_9 = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]
        section_9.content=request.POST['synthesis_text']
        artefact.section_set.add(section_9)
        section_10 = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SectionCategory.objects.get(name='CO'), title='Conclusion')[0]
        section_10.content = request.POST['conclusion_text']
        artefact.section_set.add(section_10)
        section_11 = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SectionCategory.objects.get(name='RE'), title='References')[0]
        section_11.content = request.POST['references_text']
        artefact.section_set.add(section_11)
        return super(ArtefactsUpdateView, self).post(request, **kwargs)

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

    def get_success_url(self):
        return reverse('artefacts:artefact-update', kwargs={'pk': self.object.id})


class OriginCreateView(generic.CreateView):
    """
    A view which allows the user to create an origin
    """
    model = Origin
    template_name_suffix = '_create_form'
    form_class = OriginCreateForm


class ChronologyCreateView(generic.CreateView):
    """
    A view which allows the user to create a chronology
    """
    model = ChronologyPeriod
    template_name_suffix = '_create_form'
    form_class = ChronologyCreateForm


class AlloyCreateView(generic.CreateView):
    """
    A view which allows the user to create an alloy
    """
    model = Alloy
    template_name_suffix = '_create_form'
    form_class = AlloyCreateForm


class EnvironmentCreateView(generic.CreateView):
    """
    A view which allows the user to create an environment
    """
    model = Environment
    template_name_suffix = '_create_form'
    form_class = EnvironmentCreateForm


class TechnologyCreateView(generic.CreateView):
    """
    A view which allows the user to create a technology
    """
    model = Technology
    template_name_suffix = '_create_form'
    form_class = TechnologyCreateForm


class MicrostructureCreateView(generic.CreateView):
    """
    A view which allows the user to create a microstructure
    """
    model = Microstructure
    template_name_suffix = '_create_form'
    form_class = MicrostructureCreateForm


class MetalCreateView(generic.CreateView):
    """
    A view which allows the user to create a metal
    """
    model = Metal
    template_name_suffix = '_create_form'
    form_class = MetalCreateForm


class CorrosionFormCreateView(generic.CreateView):
    """
    A view which allows the user to create a corrosion form
    """
    model = CorrosionForm
    template_name_suffix = '_create_form'
    form_class = CorrosionFormCreateForm


class CorrosionTypeCreateView(generic.CreateView):
    """
    A view which allows the user to create a corrosion type
    """
    model = CorrosionType
    template_name_suffix = '_create_form'
    form_class = CorrosionTypeCreateForm


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
