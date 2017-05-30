from collections import defaultdict

from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.template import RequestContext
from django.template.loader import render_to_string
from django.utils.html import escape
from django.views import generic
from haystack.forms import SearchForm
from django.conf import settings
from django.contrib import messages

from contacts.forms import ContactCreateForm
from stratigraphies.neo4jdao import Neo4jDAO

from .forms import ArtefactsUpdateForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter,\
    OriginCreateForm, ChronologyCreateForm, AlloyCreateForm, TechnologyCreateForm, EnvironmentCreateForm, \
    MicrostructureCreateForm, MetalCreateForm, CorrosionFormCreateForm, CorrosionTypeCreateForm, \
    RecoveringDateCreateForm, ImageCreateForm, TypeCreateForm, ContactAuthorForm, ShareArtefactForm, \
    ShareWithFriendForm, ObjectCreateForm, ObjectUpdateForm, CollaborationCommentForm
from .models import Artefact, Document, Collaboration_comment, Field, Object, Section, SectionCategory, Image, Stratigraphy, Token
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
            for artefact in artefactsfilter.qs:
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
        obj = Object.objects.get(id=artefact.object.id)


        self.object = artefact
        form_class = self.get_form_class()
        form = self.get_form(form_class)

        formObject = ObjectUpdateForm(instance=obj)

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
        return render(request, 'artefacts/artefact_update_form.html', self.get_context_data(form=form, formObject=formObject, object_section=object_section, description_section=description_section,
                                                             zone_section=zone_section, macroscopic_section=macroscopic_section,
                                                             sample_section=sample_section, analyses_performed=analyses_performed,
                                                             metal_section=metal_section, corrosion_section=corrosion_section,
                                                             synthesis_section=synthesis_section, conclusion_text=conclusion_text,
                                                             references_text=references_text, stratigraphies=stratigraphies,
                                                             node_base_url=settings.NODE_BASE_URL))

    def post(self, request, *args, **kwargs):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        # Save updates for the object name (4 following lines)
        obj = get_object_or_404(Object, pk=artefact.object.id)
        objForm = ObjectUpdateForm(request.POST, instance=obj)
        if objForm.is_valid():
            objForm.save()
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

    def get_context_data(self, **kwargs):
        """
        Allows the template to use the selected object
        """
        context = super(ArtefactsCreateView, self).get_context_data(**kwargs)
        object = get_object_or_404(Object, pk=self.kwargs['pk'])
        context['object'] = object
        return context

    def form_valid(self, form):
        form.instance.object = get_object_or_404(Object, pk=self.kwargs['pk'])
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
            subject = form.cleaned_data['subject']+" (about MiCorr artefact : "+artefact.object.name+")"
            message = form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = artefact.get_authors_email()

            if cc_myself:
                recipients.append(sender)

            send_mail(subject, message, sender, recipients)

        pageContext = {}
        messages.add_message(request, messages.SUCCESS, 'Your message has been sent!')
        return render(request, 'artefacts/contact_author_confirmation.html', pageContext)

    else:
        form = ContactAuthorForm()

    pageContext = {'form': form, 'artefact_id': artefact_id}
    return render(request, 'artefacts/contact_author_form.html', pageContext)


def shareArtefact(request, artefact_id):
    if request.method == 'POST':
        artefact = get_object_or_404(Artefact, pk=artefact_id)
        form = ShareArtefactForm(request.POST)
        if form.is_valid():
            subject = "Shared MiCorr artefact : "+artefact.object.name
            recipient = [form.cleaned_data['recipient']]
            right = form.cleaned_data['right']
            comment = form.cleaned_data['comment']
            cc_myself = form.cleaned_data['cc_myself']
            sender = request.user.email

            # create a link with a new generated token. example :
            # 'localhost:8000/artefacts/110?token=8a21008e-383b-4c13-bd9e-9c8387bf29b0'
            token = Token.tokenManager.create_token(right, artefact, request.user, comment, '-'.join(recipient))

            if right == 'R':
                link = request.get_host() + '/artefacts/' + artefact_id + '/?token='+token.uuid
            elif right == 'W':
                link = request.get_host() + '/artefacts/' + artefact_id + '/update/?token='+token.uuid

            token.link = link
            token.save()

            # create text and html content to have a clickable link
            text_message = "A MiCorr user shared an artefact with you. Please follow this " \
                           "link : "+link
            html_message = '<p>A MiCorr user shared an artefact with you. ' \
                           'Please follow this link : <a href="'+link+'">'+link+'.</p>'
            if cc_myself:
                recipient.append(sender)

            msg = EmailMultiAlternatives(subject, text_message, sender, recipient)
            msg.attach_alternative(html_message, "text/html")
            msg.send()
            messages.add_message(request, messages.SUCCESS, 'New share added successfully')

        pageContext = {'artefact': artefact}
        return render(request, 'artefacts/token_list.html', pageContext)
    else:
        form = ShareArtefactForm()

    pageContext = {'form': form, 'artefact_id': artefact_id}
    return render(request, 'artefacts/share_artefact_form.html', pageContext)


def shareArtefactWithFriend(request, artefact_id):
    if request.method == 'POST':
        artefact = get_object_or_404(Artefact, pk=artefact_id)
        form = ShareWithFriendForm(request.POST)
        if form.is_valid():
            subject = "Shared MiCorr artefact : "+artefact.object.name
            recipient = [form.cleaned_data['recipient']]
            message = form.cleaned_data['message']

            if request.user.is_anonymous():
                sender = 'noreply@micorr.org'
            else:
                sender = request.user.email

            link = request.get_host() + '/artefacts/' + artefact_id

            # create text and html content to have a clickable link
            text_message = "A MiCorr user shared an artefact with you. \n  " + message \
                           + " \n \n To see the artefact, please follow this link : "+link
            html_message = '<p>A MiCorr user shared an artefact with you.\n  ' + message \
                           + ' \n \n Please follow this link : <a href="'+link+'">'+link+'.</p>'

            msg = EmailMultiAlternatives(subject, text_message, sender, recipient)
            msg.attach_alternative(html_message, "text/html")
            msg.send()
            messages.add_message(request, messages.SUCCESS, 'The artefact was shared successfully')

        pageContext = {'artefact': artefact}
        return render(request, 'artefacts/token_list.html', pageContext)

    else:
        form = ShareWithFriendForm()

    pageContext = {'form': form, 'artefact_id': artefact_id}
    return render(request, 'artefacts/share_artefact_with_friend_form.html', pageContext)


def listToken(request, artefact_id):
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    pageContext = {'artefact': artefact}
    return render(request, 'artefacts/token_list.html', pageContext)


class TokenDeleteView(generic.DeleteView):
    model = Token
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        artefact_id = get_object_or_404(Token, pk=self.kwargs['pk']).artefact.id
        return reverse('artefacts:list_tokens', kwargs={'artefact_id': artefact_id})


def getTokenRightByUuid(token_uuid):
    token_right = None
    if token_uuid is not None:
        token = get_object_or_404(Token, uuid=token_uuid)
        token_right = token.right
    return token_right


def isArtefactOfConnectedUser(request, artefact_id):
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    is_artefact_of_connected_user = False
    if request.user.id == artefact.object.user.id:
        is_artefact_of_connected_user = True
    return is_artefact_of_connected_user


# Write right when :
# - artefact.user = logged user
# - token.right = 'W'
def hasWriteRight(request, artefact_id, token_uuid):
    has_write_right = False

    if (isArtefactOfConnectedUser(request, artefact_id)) or (getTokenRightByUuid(token_uuid) == 'W'):
        has_write_right = True
    return has_write_right


# Read right when :
# artefact.user = logged user
# token.right = 'R'
# artefact was validated by a micorr admin
def hasReadRight(request, artefact_id, token_uuid):
    has_write_right = False
    if (isArtefactOfConnectedUser(request, artefact_id)) or (getTokenRightByUuid(token_uuid) == 'R') or isValidatedById(artefact_id):
        has_write_right = True
    return has_write_right


def isValidatedById(artefact_id):
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    return artefact.validated


def isFirstUseOfToken(token_uuid):
    firstUse = False
    token = get_object_or_404(Token, uuid=token_uuid)
    if token.already_used == False:
        firstUse = True
    return firstUse


def sendFirstUseOfTokenEmail(token_uuid):
    if isFirstUseOfToken(token_uuid):
        token = get_object_or_404(Token, uuid=token_uuid)
        token.already_used = True
        token.save()

        subject = 'First use of MiCorr token'
        message = 'Your token has been used : \n Artefact : ' + token.artefact.object.name + '\n Comment : ' + str(token.comment) + '\n Link : ' + str(token.link)
        sender = 'micorr@he-arc.ch'
        recipient = [token.user.email]

        # return 0 if not sent
        return send_mail(subject, message, sender, recipient)


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

class ObjectCreateView(generic.CreateView):
    model = Object
    template_name_suffix = '_create_form'
    form_class = ObjectCreateForm

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        return super(ObjectCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:artefact-create', kwargs={'pk': self.object.id})

class CollaborationListView(generic.ListView):
    model = Token

    template_name_suffix = '_collaboration_menu'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(CollaborationListView, self).get_context_data(**kwargs)
        user = self.request.user

        # Add all the objects of the user in a variable
        allTokensShared = self.request.user.token_set.all().order_by('created')
        tokensShared = []
        tokensReceived = []


        # Research tokens shared by the user
        for token in allTokensShared :
            if token.right == 'W':
                tokensShared.append(token)

        # Research tokens shared with the user
        try :
            token = Token.tokenManager.get(recipient=user.email)
            if token.right == 'W' :
                tokensReceived.append(token)

        except :
            tokensReceived = []

        context['tokens_shared_by_me'] = tokensShared
        context['tokens_shared_with_me'] = tokensReceived
        context['user'] = user
        return context

class CollaborationUpdateView(generic.UpdateView):

    model = Artefact
    template_name_suffix = '_collaboration_update'
    """
    A detail view of a selected artefact
    """
    form_class = ArtefactsUpdateForm

    def get_object(self, queryset=None):
        token = Token.tokenManager.get(id=self.kwargs['token_id'])
        obj = Artefact.objects.get(id=token.artefact.id)
        return obj

    def get(self, request, **kwargs):

        token = Token.tokenManager.get(id=self.kwargs['token_id'])
        artefact = Artefact.objects.get(id=token.artefact.id)
        sections = artefact.section_set.all()
        obj = Object.objects.get(id=artefact.object.id)

        self.object = artefact
        form_class = self.get_form_class()
        form = self.get_form(form_class)

        sectionComments = []
        sectionDict = defaultdict(list)
        tokenComments = []
        tokenDict = defaultdict(list)
        token_type = ContentType.objects.get(model='token')
        try:
            # Get all comments for the current token
            allTokenComments = Collaboration_comment.objects.filter(content_type_id=token_type.id, object_model_id=token.id)

            # Get first comments of all fields
            firstTokenComments = []
            for tokenComm in allTokenComments:
                if not tokenComm.parent:
                    firstTokenComments.append(tokenComm)

            # Sort comments using parent_id
            allTokenCommentsSorted = []
            for firstToken in firstTokenComments:
                idToken = firstToken.id
                allTokenCommentsSorted.append(firstToken)
                while idToken != 0:
                    try:
                        currentToken = allTokenComments.get(parent_id=idToken)
                        allTokenCommentsSorted.append(currentToken)
                        idToken = currentToken.id
                    except:
                        idToken = 0

            # Filter only sent comments or comments from user connected
            for tokenComm in allTokenCommentsSorted:
                if tokenComm.sent or self.request.user == tokenComm.user:
                    tokenComments.append(tokenComm)

            # Create a dictonary 'key-list' with field title as a key
            for tokenComment in tokenComments:
                tokenDict[tokenComment.field.title].append(tokenComment)

        except:
            pass

        section_type = ContentType.objects.get(model='section')
        allSectionsComments = []

        for section in sections:
            # Get all comments from each section
            comments = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id=section.id)
            for comment in comments:
                allSectionsComments.append(comment)

        # Get first comments of all sections
        firstSectionComments = []
        for sectionComm in allSectionsComments:
            if not sectionComm.parent:
                firstSectionComments.append(sectionComm)

        # Sort comments using parent_id
        allSectionCommentsSorted = []
        for firstSection in firstSectionComments:
            idSection = firstSection.id
            allSectionCommentsSorted.append(firstSection)
            isFound = None
            while idSection != 0:
                for comm in allSectionsComments:
                    isFound = 0
                    if comm.parent_id == idSection:
                        allSectionCommentsSorted.append(comm)
                        idSection = comm.id
                        isFound = 1
                if isFound == 0:
                    idSection = 0

        for commentSectionSorted in allSectionCommentsSorted:
            # Filter only sent comments or comments from user connected
            if commentSectionSorted.sent or self.request.user == commentSectionSorted.user:
                sectionComments.append(commentSectionSorted)
                section = get_object_or_404(Section, pk=commentSectionSorted.object_model_id)
                sectionShortTitle = getSectionShortName(section.title)
                sectionDict[sectionShortTitle].append(commentSectionSorted)


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
        return render(request, 'artefacts/collaboration_artefact_update.html', self.get_context_data(artefact=artefact, form=form, object_section=object_section, description_section=description_section,
                                                             zone_section=zone_section, macroscopic_section=macroscopic_section,
                                                             sample_section=sample_section, analyses_performed=analyses_performed,
                                                             metal_section=metal_section, corrosion_section=corrosion_section,
                                                             synthesis_section=synthesis_section, conclusion_text=conclusion_text,
                                                             references_text=references_text, stratigraphies=stratigraphies,
                                                             tokenComments=dict(tokenDict), sectionComments=dict(sectionDict),
                                                             node_base_url=settings.NODE_BASE_URL))

    def post(self, request, *args, **kwargs):
        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
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
        return super(CollaborationUpdateView, self).post(request, **kwargs)

    def get_success_url(self):
        return reverse('artefacts:collaboration_menu')

class CollaborationCommentView(generic.CreateView):

    model = Collaboration_comment
    template_name_suffix = '_form'
    form_class = CollaborationCommentForm

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
        user = self.request.user
        context = super(CollaborationCommentView, self).get_context_data(**kwargs)
        token = get_object_or_404(Token, pk=self.kwargs['pk'])
        artefact = token.artefact
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        stratigraphies = artefact.stratigraphy_set.all()
        sectionComments = []
        sectionDict = defaultdict(list)
        tokenComments = []
        tokenDict = defaultdict(list)
        token_type = ContentType.objects.get(model='token')
        try :
            # Get all comments for the current token
            allTokenComments = Collaboration_comment.objects.filter(content_type_id=token_type.id, object_model_id = token.id)

            # Get first comments of all fields
            firstTokenComments = []
            for tokenComm in allTokenComments :
                if not tokenComm.parent :
                    firstTokenComments.append(tokenComm)

            # Sort comments using parent_id
            allTokenCommentsSorted = []
            for firstToken in firstTokenComments :
                idToken = firstToken.id
                allTokenCommentsSorted.append(firstToken)
                while idToken != 0 :
                    try :
                        currentToken = allTokenComments.get(parent_id=idToken)
                        allTokenCommentsSorted.append(currentToken)
                        idToken = currentToken.id
                    except :
                        idToken = 0

            # Filter only sent comments or comments from user connected
            for tokenComm in allTokenCommentsSorted :
                if tokenComm.sent or self.request.user == tokenComm.user :
                    tokenComments.append(tokenComm)

            # Create a dictonary 'key-list' with field title as a key
            for tokenComment in tokenComments :
                tokenDict[tokenComment.field.title].append(tokenComment)

        except :
            pass

        section_type = ContentType.objects.get(model='section')
        allSectionsComments = []

        for section in sections :
            # Get all comments from each section
            comments = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id = section.id)
            for comment in comments :
                allSectionsComments.append(comment)

        # Get first comments of all sections
        firstSectionComments = []
        for sectionComm in allSectionsComments:
            if not sectionComm.parent:
                firstSectionComments.append(sectionComm)

        # Sort comments using parent_id
        allSectionCommentsSorted = []
        for firstSection in firstSectionComments:
            idSection = firstSection.id
            allSectionCommentsSorted.append(firstSection)
            isFound = None
            while idSection != 0:
                for comm in allSectionsComments :
                    isFound = 0
                    if comm.parent_id == idSection :
                        allSectionCommentsSorted.append(comm)
                        idSection = comm.id
                        isFound = 1
                if isFound==0 :
                    idSection=0

        for commentSectionSorted in allSectionCommentsSorted :
            # Filter only sent comments or comments from user connected
            if commentSectionSorted.sent or self.request.user == commentSectionSorted.user :
                sectionComments.append(commentSectionSorted)
                section = get_object_or_404(Section, pk=commentSectionSorted.object_model_id)
                sectionShortTitle = getSectionShortName(section.title)
                sectionDict[sectionShortTitle].append(commentSectionSorted)

        context['user'] = user
        context['token'] = token
        context['artefact'] = artefact
        context['sections'] = sections
        context['documents'] = documents
        context['stratigraphies'] = stratigraphies
        context['tokenComments'] = dict(tokenDict)
        context['sectionComments'] = dict(sectionDict)
        context['node_base_url'] = settings.NODE_BASE_URL
        return context

    def get_field_last_comment_id(self, token, field, model):
        lastId = 0
        try :
            commentsExisting = Collaboration_comment.objects.filter(content_type_id=model.id, object_model_id=token.id, field_id=field.id)
            if commentsExisting:
                lastId = 0
                idComm = 0
                for comment in commentsExisting:
                    if not comment.parent:
                        idComm = comment.id

                while lastId == 0:
                    isFound = 0
                    for comment in commentsExisting:
                        if comment.parent_id == idComm:
                            idComm = comment.id
                            isFound = 1
                    if isFound == 0:
                        lastId = idComm
                return lastId
            else :
                return lastId
        except :
            return 0

    def get_section_last_comment_id(self, section, model):
        lastId = 0
        try :
            commentsExisting = Collaboration_comment.objects.filter(content_type_id=model.id, object_model_id=section.id)
            if commentsExisting:
                lastId = 0
                idComm = 0
                for comment in commentsExisting:
                    if not comment.parent:
                        idComm = comment.id

                while lastId == 0:
                    isFound = 0
                    for comment in commentsExisting:
                        if comment.parent_id == idComm:
                            idComm = comment.id
                            isFound = 1
                    if isFound == 0:
                        lastId = idComm
                return lastId
            else :
                return lastId
        except :
            return 0

    def form_valid(self, form):
        try :
            token = Token.tokenManager.get(pk=self.kwargs['pk'])
            field = get_object_or_404(Field, title=self.kwargs['field'])
            form.instance.field = field
            form.instance.content_object = token
            token_type = ContentType.objects.get(model='token')

            if self.get_field_last_comment_id(token, field, token_type) != 0 :
                lastId = self.get_field_last_comment_id(token, field, token_type)
                form.instance.parent_id = lastId

        except :
            token = Token.tokenManager.get(pk=self.kwargs['pk'])
            sectionTitle = getSectionCompleteName(self.kwargs['field'])
            section = Section.objects.get(title=sectionTitle, artefact=token.artefact)
            form.instance.content_object = section
            section_type = ContentType.objects.get(model='section')

            if self.get_section_last_comment_id(section, section_type) != 0 :
                lastId = self.get_section_last_comment_id(section, section_type)
                form.instance.parent_id = lastId

        user = self.request.user
        form.instance.user = user

        return super(CollaborationCommentView, self).form_valid(form)

    def get_success_url(self):

        return reverse('artefacts:collaboration-comment', kwargs={'pk' : self.kwargs['pk'], 'field' : 'none'})

def getSectionCompleteName(sectionTitle):
    if sectionTitle == 'object' :
        return 'The object'
    elif sectionTitle == 'zones' :
        return 'Zones of the artefact submitted to visual observation and location of sampling areas'
    elif sectionTitle == 'macroscopic' :
        return 'Macroscopic observation'
    elif sectionTitle == 'sample' :
        return 'Sample'
    elif sectionTitle == 'anaResults' :
        return 'Analyses and results'
    elif sectionTitle == 'metal' :
        return 'Metal'
    elif sectionTitle == 'corrLayers' :
        return 'Corrosion layers'
    elif sectionTitle == 'synthesis' :
        return 'Synthesis of the macroscopic / microscopic observation of corrosion layers'
    elif sectionTitle == 'conclusion' :
        return 'Conclusion'
    elif sectionTitle == 'references' :
        return 'References'

def getSectionShortName(sectionTitle):
    if sectionTitle == 'The object' :
        return 'object'
    elif sectionTitle == 'Zones of the artefact submitted to visual observation and location of sampling areas' :
        return 'zones'
    elif sectionTitle == 'Macroscopic observation' :
        return 'macroscopic'
    elif sectionTitle == 'Sample' :
        return 'sample'
    elif sectionTitle == 'Analyses and results' :
        return 'anaResults'
    elif sectionTitle == 'Metal' :
        return 'metal'
    elif sectionTitle == 'Corrosion layers' :
        return 'corrLayers'
    elif sectionTitle == 'Synthesis of the macroscopic / microscopic observation of corrosion layers' :
        return 'synthesis'
    elif sectionTitle == 'Conclusion' :
        return 'conclusion'
    elif sectionTitle == 'References' :
        return 'references'

def sendComments(request, token_id) :
    if request.method == 'POST':
        token = get_object_or_404(Token, pk=token_id)
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
        sections = artefact.section_set.all()
        token_type = ContentType.objects.get(model='token')
        section_type = ContentType.objects.get(model='section')

        try :
            commentsTokenAll = Collaboration_comment.objects.filter(content_type_id=token_type.id, object_model_id=token.id)
            for comment in commentsTokenAll:
                if comment.user == request.user and comment.sent == False:
                    comment.sent = True
                    comment.save()
        except:
            pass

        try :
            for section in sections :
                commentsSectionEach = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id=section.id)

                for comment in commentsSectionEach :
                    if comment.user == request.user and comment.sent == False:
                        comment.sent = True
                        comment.save()
        except:
            pass

        return redirect('artefacts:collaboration_menu')


def deleteComment(request, comment_id, token_id) :
        comment = get_object_or_404(Collaboration_comment, pk=comment_id)
        comment.sent = True
        comment.save()
        pageContext = {'pk': token_id, 'field': 'none'}
        return reverse('artefacts:collaboration_comment', pageContext)
