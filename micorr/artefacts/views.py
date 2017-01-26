from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.template import RequestContext
from django.utils.html import escape
from django.views import generic
from haystack.forms import SearchForm
from django.conf import settings

from contacts.forms import ContactCreateForm
from stratigraphies.neo4jdao import Neo4jDAO
from .forms import ArtefactsUpdateForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter,\
    OriginCreateForm, ChronologyCreateForm, AlloyCreateForm, TechnologyCreateForm, EnvironmentCreateForm, \
    MicrostructureCreateForm, MetalCreateForm, CorrosionFormCreateForm, CorrosionTypeCreateForm, \
    RecoveringDateCreateForm, ImageCreateForm, TypeCreateForm, ContactAuthorForm
from .models import Artefact, Document, Section, SectionCategory, Image, Stratigraphy
import logging

logger = logging.getLogger(__name__)

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
                       'self': self, 'node_base_url': settings.NODE_BASE_URL})


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
        context['node_base_url'] = settings.NODE_BASE_URL
        return context


class ArtefactsUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit an artefact
    When the editing is finished, it redirects the user to the artefact detail page
    """
    model = Artefact
    form_class = ArtefactsUpdateForm

    def get_object(self, queryset=None):
        obj = Artefact.objects.get(id=self.kwargs['pk'])
        return obj

    def get(self, request, **kwargs):
        artefact = Artefact.objects.get(id=self.kwargs['pk'])
        self.object = artefact
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        object_section = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='The object')[0]
        description_section = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='Description and visual observation')[0]
        zone_section = Section.objects.get_or_create(order=3, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        macroscopic_section = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Macroscopic observation')[0]
        sample_section = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SectionCategory.objects.get(name='SA'), title='Sample')[0]
        analyses_performed = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Analyses and results')[0].content
        metal_section = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Metal')[0]
        corrosion_section = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Corrosion layers')[0]
        synthesis_section = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SectionCategory.objects.get(name='AN'), title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]
        conclusion_text = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SectionCategory.objects.get(name='CO'), title='Conclusion')[0].content
        references_text = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SectionCategory.objects.get(name='RE'), title='References')[0].content
        stratigraphies = artefact.stratigraphy_set.all
        return render(request, 'artefacts/artefact_update_form.html', self.get_context_data(form=form, object_section=object_section, description_section=description_section,
                                                             zone_section=zone_section, macroscopic_section=macroscopic_section,
                                                             sample_section=sample_section, analyses_performed=analyses_performed,
                                                             metal_section=metal_section, corrosion_section=corrosion_section,
                                                             synthesis_section=synthesis_section, conclusion_text=conclusion_text,
                                                             references_text=references_text, stratigraphies=stratigraphies,
                                                             node_base_url=settings.NODE_BASE_URL))

    def post(self, request, *args, **kwargs):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        section_1 = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SectionCategory.objects.get(name='AR'), title='The object')[0]
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
        return reverse('users:detail', kwargs={'username': self.request.user})


class ArtefactsDeleteView(generic.DeleteView):
    """
    A view which allows the user to delete an artefact
    When the artefact is deleted, it redirects the user to the artefact list
    """
    model = Artefact
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        return reverse('users:detail', kwargs={'username': self.request.user})


class ArtefactsCreateView(generic.CreateView):
    """
    A view which allows the user to create an artefact
    When the artefact is created, it redirects the user to the artefact list
    """
    model = Artefact
    template_name_suffix = '_create_form'
    form_class = ArtefactsCreateForm

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        return super(ArtefactsCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:artefact-update', kwargs={'pk': self.object.id})


@login_required
def newAuthor(request):
    return handlePopAdd(request, ContactCreateForm, 'author')


@login_required
def newType(request):
    return handlePopAdd(request, TypeCreateForm, 'type')


@login_required
def newOrigin(request):
    return handlePopAdd(request, OriginCreateForm, 'origin')


@login_required
def newRecoveringDate(request):
    return handlePopAdd(request, RecoveringDateCreateForm, 'recovering_date')


@login_required
def newChronologyPeriod(request):
    return handlePopAdd(request, ChronologyCreateForm, 'chronology_period')


@login_required
def newEnvironment(request):
    return handlePopAdd(request, EnvironmentCreateForm, 'environment')


@login_required
def newLocation(request):
    return handlePopAdd(request, ContactCreateForm, 'location')


@login_required
def newOwner(request):
    return handlePopAdd(request, ContactCreateForm, 'owner')


@login_required
def newAlloy(request):
    return handlePopAdd(request, AlloyCreateForm, 'alloy')


@login_required
def newTechnology(request):
    return handlePopAdd(request, TechnologyCreateForm, 'technology')


@login_required
def newSampleLocation(request):
    return handlePopAdd(request, ContactCreateForm, 'sample_location')


@login_required
def newResponsibleInstitution(request):
    return handlePopAdd(request, ContactCreateForm, 'responsible_institution')


@login_required
def newMicrostructure(request):
    return handlePopAdd(request, MicrostructureCreateForm, 'microstructure')


@login_required
def newMetal1(request):
    return handlePopAdd(request, MetalCreateForm, 'metal1')


@login_required
def newMetalX(request):
    return handlePopAdd(request, MetalCreateForm, 'metalx')


@login_required
def newCorrosionForm(request):
    return handlePopAdd(request, CorrosionFormCreateForm, 'corrosion_form')


@login_required
def newCorrosionType(request):
    return handlePopAdd(request, CorrosionTypeCreateForm, 'corrosion_type')


def handlePopAdd(request, addForm, field):
    if request.method == "POST":
        form = addForm(request.POST)
        if form.is_valid():
            try:
                newObject = form.save()
            except form.ValidationError, error:
                newObject = None
            if newObject:
                return HttpResponse('<script type="text/javascript">opener.dismissAddAnotherPopup(window, "%s", "%s");</script>' % (escape(newObject._get_pk_val()), escape(newObject)))
    else:
        form = addForm()
    pageContext = {'form': form, 'field': field}
    return render(request, "artefacts/popadd.html", pageContext)


def contactAuthor(request, artefact_id):
    if request.method == 'POST':
        artefact = get_object_or_404(Artefact, pk=artefact_id)
        form = ContactAuthorForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data['subject']+" (about MiCorr artefact : "+artefact.name+")"
            message = form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = artefact.get_authors_email()

            if cc_myself:
                recipients.append(sender)

            send_mail(subject, message, sender, recipients)

        return HttpResponse('Email sent!')
    else:
        form = ContactAuthorForm()

    pageContext = {'form': form, 'artefact_id': artefact_id}
    return render(request, 'artefacts/contact_author_form.html', pageContext)


class ImageCreateView(generic.CreateView):
    model = Image
    form_class = ImageCreateForm

    def get(self, request, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        section_id = kwargs['section_id']
        return render(request, "artefacts/artefact_create_form.html", self.get_context_data(form=form, section_id=section_id))

    def form_valid(self, form):
        form.instance.section = get_object_or_404(Section, pk=self.kwargs['section_id'])
        return super(ImageCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:image-refresh', kwargs={'section_id': self.kwargs['section_id']})


class ImageUpdateView(generic.UpdateView):
    model = Image
    form_class = ImageCreateForm

    def get(self, request, **kwargs):
        self.object = get_object_or_404(Image, id=self.kwargs['pk'])
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        section_id = kwargs['section_id']
        image_id = kwargs['pk']
        return self.render(request, "artefacts/artefact_update_form.html", self.get_context_data(form=form, section_id=section_id, image_id=image_id))

    def get_success_url(self):
        return reverse('artefacts:image-refresh', kwargs={'section_id': self.kwargs['section_id']})


class ImageDeleteView(generic.DeleteView):
    model = Image
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        section_id = get_object_or_404(Image, pk=self.kwargs['pk']).section.id
        return reverse('artefacts:image-refresh', kwargs={'section_id': section_id})


def RefreshDivView(request, section_id):
    object_section = get_object_or_404(Section, pk=section_id)
    return render(request, 'artefacts/image_section.html', {'object_section': object_section})


def StratigraphyListView(request, artefact_id):
    stratigraphies = Neo4jDAO().getStratigraphiesByUser(request.user.id)
    return render(request, 'artefacts/stratigraphies_list.html', {'stratigraphies': stratigraphies, 'artefact_id': artefact_id})


def StratigraphyAddView(request, artefact_id, stratigraphy_uid):
    stratigraphy = Stratigraphy.objects.get_or_create(uid=stratigraphy_uid, artefact=get_object_or_404(Artefact, id=artefact_id))[0]
    stratigraphy.image = settings.NODE_BASE_URL + 'exportStratigraphy?name='+ stratigraphy_uid +'&width=300&format=png'
    stratigraphy.save()
    return render(request, 'artefacts/strat-refresh.html', {'artefact_id': artefact_id})


class StratigraphyDeleteView(generic.DeleteView):
    model = Stratigraphy
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        artefact_id = get_object_or_404(Stratigraphy, pk=self.kwargs['pk']).artefact.id
        return reverse('artefacts:strat-refresh', kwargs={'artefact_id': artefact_id})


def RefreshStratDivView(request, artefact_id):
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    return render(request, 'artefacts/stratigraphy.html', {'artefact': artefact, 'node_base_url': settings.NODE_BASE_URL})


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
