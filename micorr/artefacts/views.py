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
from django.http import Http404

from contacts.forms import ContactCreateForm
from contacts.models import Contact
from stratigraphies.neo4jdao import Neo4jDAO
from users.models import User

from .forms import ArtefactsForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter, \
    OriginCreateForm, ChronologyCreateForm, AlloyCreateForm, TechnologyCreateForm, EnvironmentCreateForm, \
    MicrostructureCreateForm, MetalCreateForm, CorrosionFormCreateForm, CorrosionTypeCreateForm, \
    RecoveringDateCreateForm, ImageCreateForm, TypeCreateForm, ContactAuthorForm, ShareArtefactForm, \
    ShareWithFriendForm, ObjectCreateForm, ObjectUpdateForm, CollaborationCommentForm, TokenHideForm, \
    PublicationDecisionForm, PublicationDelegateForm, PublicationRejectDecisionForm, StratigraphyCreateForm, \
    ArfactsDescriptionForm, ArfactsSampleForm

from .models import Artefact, Document, Collaboration_comment, Field, Object, Section, SectionCategory, Image, \
    Stratigraphy, Token, \
    Publication, ChronologyPeriod
from . import models

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

# here we cache SectionCategory model instances "frequently accessesed" in all views
SC_ARTEFACT = SectionCategory.objects.get(name=SectionCategory.ARTEFACT)
SC_SAMPLE = SectionCategory.objects.get(name=SectionCategory.SAMPLE)
SC_ANALYSIS_AND_RESULTS = SectionCategory.objects.get(name=SectionCategory.ANALYSIS_AND_RESULTS)
SC_CONCLUSION = SectionCategory.objects.get(name=SectionCategory.CONCLUSION)
SC_REFERENCES = SectionCategory.objects.get(name=SectionCategory.REFERENCES)


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
                if artefact.object in artefactsfilter.qs:
                    filtered_artefacts_list.append(artefact.object)
        else:
            for artefact in artefactsfilter.qs:
                if artefact.published :
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
    template_name = 'artefacts/artefact_update_page.html'
    def get_context_data(self, **kwargs):
        """
        Allows the template to use the selected artefact as well as its foreign keys pointers
        """
        context = super(ArtefactsDetailView, self).get_context_data(**kwargs)
        context['artefact'] = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        context['sections'] = context['artefact'].section_set.all()
        context['documents'] = context['artefact'].document_set.all()
        context['node_base_url'] = settings.NODE_BASE_URL

        forms = {SectionCategory.ARTEFACT: ArfactsDescriptionForm(instance=self.object, label_suffix=''),
                 SectionCategory.SAMPLE: ArfactsSampleForm(instance=self.object, label_suffix=''),
                 SectionCategory.ANALYSIS_AND_RESULTS: ObjectUpdateForm(instance=context['artefact'].object)
                 }
        for section_category,form in forms.items():
            for fieldname,field in form.fields.items():
                field.disabled = True

        section_groups, group = [], []
        current_category = None
        for s in context['sections']:
            if current_category != s.section_category:
                if len(group):
                    section_groups.append(group)
                current_category = s.section_category
                group = []
            group.append({'section': s, 'form': forms.get(s.section_category.name)})
        if len(group):
            section_groups.append(group)
        context['section_groups'] = section_groups

        return context


class ArtefactsUpdateView(generic.UpdateView):
    """
    A view which allows the user to edit an artefact
    When the editing is finished, it redirects the user to the artefact detail page
    """

    model = Artefact
    form_class = ArtefactsForm

    template_name_suffix = '_update_page'

    # def get_object(self, queryset=None):
    #     obj = Artefact.objects.get(id=self.kwargs['pk'])
    #     return obj


    #def get(self, request, **kwargs):
    def get_context_data(self, **kwargs):
        context = super(ArtefactsUpdateView,self).get_context_data(**kwargs)
        description_form = ArfactsDescriptionForm(instance=self.object,label_suffix = '')

        artefact = self.object
        obj = Object.objects.get(id=artefact.object.id)

        #if user want to update an artefact with parent (= artefact for publication), raise 404
        errorUpdatePublicationArtefact(self.kwargs['pk'])

        formObject = ObjectUpdateForm(instance=obj)


        object_section = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SC_ARTEFACT, title='The object')[0]
        description_section = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SC_ARTEFACT, title='Description and visual observation')[0]

        zone_section = Section.objects.get_or_create(order=3, artefact=artefact, section_category=SC_SAMPLE, title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        macroscopic_section = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SC_SAMPLE, title='Macroscopic observation')[0]
        sample_section = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SC_SAMPLE, title='Sample')[0]

        analyses_performed = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Analyses and results')[0]
        analyses_performed_text = analyses_performed.content
        metal_section = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Metal')[0]
        corrosion_section = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Corrosion layers')[0]
        synthesis_section = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]

        conclusion = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SC_CONCLUSION, title='Conclusion')[0]
        conclusion_text = conclusion.content

        references = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SC_REFERENCES, title='References')[0]
        references_text = references.content
        section_groups = [
            [{'section': object_section, 'level': 1, 'form': formObject}
             ],
            [{'section': description_section, 'level': 1, 'form': description_form},
             {'section': zone_section, 'level': 2, 'form': None},
             {'section': macroscopic_section, 'level': 2, 'form': None}
             ],
            [{'section': sample_section, 'level': 1, 'form': ArfactsSampleForm} #context['form']
             ],
            [{'section': analyses_performed, 'level': 1, 'form': None},
             {'section': metal_section, 'level': 2, 'form': None},
             {'section': corrosion_section, 'level': 2, 'form': None}
             ],
            [{'section': synthesis_section, 'level': 1, 'form': None}
             ],
            [{'section': conclusion, 'level': 1, 'form': None}
             ],
            [{'section': references, 'level': 1, 'form': None}
             ]
        ]
        context.update(formObject=formObject, description_form=description_form, object_section=object_section,
                       description_section=description_section,
                       section_groups=section_groups,
                       zone_section=zone_section, macroscopic_section=macroscopic_section,
                       sample_section=sample_section, analyses_performed=analyses_performed,
                       metal_section=metal_section, corrosion_section=corrosion_section,
                       synthesis_section=synthesis_section, conclusion_text=conclusion_text,
                       references_text=references_text,
                       node_base_url=settings.NODE_BASE_URL,
                       view='ArtefactsUpdateView')
        return context

    def post(self, request, *args, **kwargs):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        # Save updates for the object name (4 following lines)
        obj = get_object_or_404(Object, pk=artefact.object.id)
        objForm = ObjectUpdateForm(request.POST, instance=obj)
        if objForm.is_valid():
            objForm.save()
        section_1 = Section.objects.update_or_create(order=1, artefact=artefact, section_category=SC_ARTEFACT, title='The object')[0]
        artefact.section_set.add(section_1)
        section_2 = Section.objects.update_or_create(defaults={'complementary_information':request.POST['complementary_information']},
                    order=2, artefact=artefact, section_category=SC_ARTEFACT, title='Description and visual observation')[0]
        artefact.section_set.add(section_2)

        section_3 = Section.objects.update_or_create(order=3, artefact=artefact, section_category=SC_SAMPLE, title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        artefact.section_set.add(section_3)

        section_4 = Section.objects.update_or_create(defaults={'content':request.POST['macroscopic_text']},
                    order=4, artefact=artefact, section_category=SC_SAMPLE, title='Macroscopic observation')[0]
        artefact.section_set.add(section_4)
        section_5 = Section.objects.update_or_create(defaults={'complementary_information':request.POST['sample_complementary_information']},
                                                     order=5, artefact=artefact, section_category=SC_SAMPLE, title='Sample')[0]
        # images sample
        artefact.section_set.add(section_5)
        section_6 = Section.objects.update_or_create(defaults={'content':request.POST['analyses_performed']},
                                                     order=6, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Analyses and results')[0]
        artefact.section_set.add(section_6)
        section_7 = Section.objects.update_or_create(defaults={'content':request.POST['metal_text'],
                                                               'complementary_information':request.POST['metal_complementary_information']},
                                                     order=7, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Metal')[0]
        # images metal
        artefact.section_set.add(section_7)
        section_8 = Section.objects.update_or_create(defaults={'content':request.POST['corrosion_text'],
                                                               'complementary_information': request.POST['corrosion_complementary_information']},
                                                     order=8, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Corrosion layers')[0]
        artefact.section_set.add(section_8)
        section_9 = Section.objects.update_or_create(defaults={'content':request.POST['synthesis_text']},
                                                               order=9, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]
        artefact.section_set.add(section_9)
        section_10 = Section.objects.update_or_create(defaults={'content':request.POST['conclusion_text']},
                                                      order=10, artefact=artefact, section_category=SC_CONCLUSION, title='Conclusion')[0]
        artefact.section_set.add(section_10)
        section_11 = Section.objects.update_or_create(defaults={'content':request.POST['references_text']},
                                                      order=11, artefact=artefact, section_category=SC_REFERENCES, title='References')[0]
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
        object = Object.objects.get(pk=self.kwargs['object_id'])
        object.delete()
        return reverse('users:detail', kwargs={'username': self.request.user})

class ObjectCreateView(generic.CreateView):
    model = Object
    template_name_suffix = '_create_form'
    form_class = ObjectCreateForm

    def form_valid(self, form):
        user = self.request.user
        form.instance.user = user
        newObject = form.save()
        newArtefact = Artefact()
        newArtefact.object = newObject
        newArtefact.save()
        form.save()
        return super(ObjectCreateView, self).form_valid(form)

    def get_success_url(self):
        object=get_object_or_404(Object, pk=self.object.id)
        artefact=get_object_or_404(Artefact, object_id=object.id)
        return reverse('artefacts:artefact-update', kwargs={'pk': artefact.id})

"""class ArtefactsCreateView(generic.CreateView):

    A view which allows the user to create an artefact
    When the artefact is created, it redirects the user to the artefact list

    model = Artefact
    template_name_suffix = '_create_form'
    form_class = ArtefactsCreateForm

    def get_context_data(self, **kwargs):

        Allows the template to use the selected object

        context = super(ArtefactsCreateView, self).get_context_data(**kwargs)
        object = get_object_or_404(Object, pk=self.kwargs['pk'])
        context['object'] = object
        return context

    def form_valid(self, form):
        form.instance.object = get_object_or_404(Object, pk=self.kwargs['pk'])
        return super(ArtefactsCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:artefact-update', kwargs={'pk': self.object.id})"""

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
    return handlePopAdd(request, MetalCreateForm, 'metal1', 'metal')


@login_required
def newMetalX(request):
    return handlePopAdd(request, MetalCreateForm, 'metalx', 'metal')


@login_required
def newCorrosionForm(request):
    return handlePopAdd(request, CorrosionFormCreateForm, 'corrosion_form')


@login_required
def newCorrosionType(request):
    return handlePopAdd(request, CorrosionTypeCreateForm, 'corrosion_type')


def handlePopAdd(request, addForm, field, field_name=None):
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
        if not field_name:
            field_name = field
    pageContext = {'form': form, 'field': field, 'field_name':field_name}
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
                #link = request.get_host() + '/artefacts/' + artefact_id + '/update/?token='+token.uuid
                link = request.get_host() + '/artefacts/collaboration/'

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

    if request.user.is_superuser or (isArtefactOfConnectedUser(request, artefact_id)) or (getTokenRightByUuid(token_uuid) == 'W'):
        has_write_right = True
    return has_write_right


# Read right when :
# artefact.user = logged user
# token.right = 'R'
# artefact was validated by a micorr admin
def hasReadRight(request, artefact_id, token_uuid):
    has_write_right = False
    if request.user.is_superuser or isArtefactOfConnectedUser(request, artefact_id) or getTokenRightByUuid(token_uuid) == 'R' or isValidatedById(artefact_id):
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
    template_name_suffix="_create_form"
    form_class = ImageCreateForm

    def get(self, request, **kwargs):
        self.object = None
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        section_id = kwargs['section_id']
        return self.render_to_response(self.get_context_data(form=form, section_id=section_id))

    def form_valid(self, form):
        form.instance.section = get_object_or_404(Section, pk=self.kwargs['section_id'])
        return super(ImageCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:image-refresh', kwargs={'section_id': self.kwargs['section_id']})


class ImageUpdateView(generic.UpdateView):
    model = Image
    template_name_suffix="_update_form"
    form_class = ImageCreateForm

    def get(self, request, **kwargs):
        self.object = get_object_or_404(Image, id=self.kwargs['pk'])
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        section_id = kwargs['section_id']
        image_id = kwargs['pk']
        return self.render_to_response(self.get_context_data(form=form, section_id=section_id, image_id=image_id))

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


def StratigraphyListView(request, section_id):
    stratigraphies = Neo4jDAO().getStratigraphiesByUser(request.user.id)
    return render(request, 'artefacts/stratigraphies_list.html', {'node_base_url': settings.NODE_BASE_URL, 'stratigraphies': stratigraphies, 'section_id': section_id})


def StratigraphyAddView(request, section_id, stratigraphy_uid):
    stratigraphy = Stratigraphy.objects.get_or_create(uid=stratigraphy_uid, section=get_object_or_404(Section, id=section_id))[0]
    stratigraphy.image = settings.NODE_BASE_URL + 'exportStratigraphy?name='+ stratigraphy_uid +'&width=300&format=png'
    stratigraphy.save()
    return render(request, 'artefacts/strat-refresh.html', {'section_id': section_id})

class StratigraphyUpdateView(generic.UpdateView):
    model = Stratigraphy
    template_name_suffix="_update_form"
    form_class = StratigraphyCreateForm

    def get(self, request, **kwargs):
        self.object = get_object_or_404(self.model, pk=self.kwargs['pk'])
        return self.render_to_response(self.get_context_data(form=self.get_form(),section_id=kwargs['section_id'], pk=self.object.pk))

    def get_success_url(self):
        return reverse('artefacts:strat-refresh', kwargs={'section_id': self.object.section_id})



class StratigraphyDeleteView(generic.DeleteView):
    model = Stratigraphy
    template_name_suffix = '_confirm_delete'

    def get_success_url(self):
        section_id = get_object_or_404(Stratigraphy, pk=self.kwargs['pk']).section.id
        return reverse('artefacts:strat-refresh', kwargs={'section_id': section_id})


def RefreshStratDivView(request, section_id):
    section = get_object_or_404(Section, pk=section_id)
    return render(request, 'artefacts/stratigraphy.html', { 'view':'ArtefactsUpdateView', 'section': section, 'node_base_url': settings.NODE_BASE_URL})


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

def errorUpdatePublicationArtefact(artefact_id) :
    artefact = get_object_or_404(Artefact, pk=artefact_id)
    if artefact.parent :
        raise Http404

def errorAccessToken(token_id, user) :
    token = get_object_or_404(Token, pk=token_id)
    if token.user != user and token.recipient != user.email :
        raise Http404

class CollaborationListView(generic.ListView):
    model = Token
    template_name_suffix = '_collaboration_menu'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(CollaborationListView, self).get_context_data(**kwargs)
        user = self.request.user

        # Add all the objects of the user in a variable
        tokensShared = []
        tokensReceived = []
        modelToken = ContentType.objects.get(model='token')
        modelSection = ContentType.objects.get(model='section')

        # Research tokens shared by the user
        nbTotSha = 0
        newCommentsForTokenSha = {}
        try :
            tokensShared = self.request.user.token_set.filter(right='W', hidden_by_author=False).order_by('-modified')
            for token in tokensShared :
                nbCommSha = 0
                commentsToken = Collaboration_comment.objects.filter(content_type_id=modelToken.id, object_model_id=token.id, sent=True, read=False).exclude(user=self.request.user)
                nbCommSha = nbCommSha + len(commentsToken)
                commentsSection = Collaboration_comment.objects.filter(content_type_id=modelSection.id, token_for_section=token, sent=True, read=False).exclude(user=self.request.user)
                nbCommSha = nbCommSha + len(commentsSection)
                newCommentsForTokenSha[token.id] = nbCommSha
                nbTotSha = nbTotSha+nbCommSha
        except:
            pass

        # Research tokens shared with the user
        nbTotRec=0
        newTokens=0
        newCommentsForTokenRec = {}
        try :
            tokensReceived = Token.tokenManager.filter(recipient=user.email, right='W', hidden_by_recipient=False)
            for token in tokensReceived :
                nbCommRec=0
                commentsToken = Collaboration_comment.objects.filter(content_type_id=modelToken.id, object_model_id=token.id, sent=True, read=False).exclude(user=self.request.user)
                nbCommRec = nbCommRec + len(commentsToken)
                commentsSection = Collaboration_comment.objects.filter(content_type_id=modelSection.id, token_for_section=token, sent=True, read=False).exclude(user=self.request.user)
                nbCommRec = nbCommRec + len(commentsSection)
                newCommentsForTokenRec[token.id] = nbCommRec
                nbTotRec = nbTotRec+nbCommRec
                if token.read == False :
                    newTokens = newTokens + 1
        except :
            pass

        context['newCommentsSha'] = nbTotSha
        context['newCommentsRec'] = nbTotRec
        context['newTokens'] = newTokens
        context['commentsForEachTokenSha'] = newCommentsForTokenSha
        context['commentsForEachTokenRec'] = newCommentsForTokenRec
        context['tokens_shared_by_me'] = tokensShared
        context['tokens_shared_with_me'] = tokensReceived
        context['user'] = user
        return context

class CollaborationUpdateView(generic.UpdateView):

    model = Artefact
    template_name_suffix = '_collaboration_update'
    form_class = ArtefactsForm

    def get_object(self, queryset=None):
        token = Token.tokenManager.get(id=self.kwargs['token_id'])
        obj = Artefact.objects.get(id=token.artefact.id)
        return obj

    def get(self, request, **kwargs):

        errorAccessToken(self.kwargs['token_id'], self.request.user)

        token = Token.tokenManager.get(id=self.kwargs['token_id'])
        artefact = Artefact.objects.get(id=token.artefact.id)
        sections = artefact.section_set.all()
        obj = Object.objects.get(id=artefact.object.id)
        user=self.request.user

        if token.read == False :
            token.read = True
            token.save()

        self.object = artefact
        form_class = self.get_form_class()
        form = self.get_form(form_class)

        sectionComments = []
        sectionDict = defaultdict(list)
        tokenComments = []
        tokenDict = defaultdict(list)
        token_type = ContentType.objects.get(model='token')
        unreadCommentsField = {}
        unreadCommentsSection = {}
        fields = Field.objects.all()
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

            # Research fields with unread comments
            for field in fields :
                unreadCommentsField[field.title] = False

            for tokenComment in tokenComments :
                if tokenComment.read == False and tokenComment.user != self.request.user :
                    unreadCommentsField[tokenComment.field.title] = True

        except:
            pass

        section_type = ContentType.objects.get(model='section')
        allSectionsComments = []

        for section in sections:
            # Get all comments from each section
            comments = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id=section.id, token_for_section_id=token.id)
            for comment in comments:
                allSectionsComments.append(comment)

            sectionShortTitle = getSectionShortName(section.title)
            unreadCommentsSection[sectionShortTitle] = False

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
            if commentSectionSorted.token_for_section == token:
                if commentSectionSorted.sent or self.request.user == commentSectionSorted.user:
                    sectionComments.append(commentSectionSorted)
                    section = get_object_or_404(Section, pk=commentSectionSorted.object_model_id)
                    sectionShortTitle = getSectionShortName(section.title)
                    sectionDict[sectionShortTitle].append(commentSectionSorted)
                    if commentSectionSorted.read == False and commentSectionSorted.user != user:
                        unreadCommentsSection[sectionShortTitle] = True


        object_section = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SC_ARTEFACT, title='The object')[0]
        description_section = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SC_ARTEFACT, title='Description and visual observation')[0]
        zone_section = Section.objects.get_or_create(order=3, artefact=artefact, section_category=SC_SAMPLE, title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        macroscopic_section = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SC_SAMPLE, title='Macroscopic observation')[0]
        sample_section = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SC_SAMPLE, title='Sample')[0]
        analyses_performed = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Analyses and results')[0].content
        metal_section = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Metal')[0]
        corrosion_section = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Corrosion layers')[0]
        synthesis_section = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]
        conclusion_text = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SC_CONCLUSION, title='Conclusion')[0].content
        references_text = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SC_REFERENCES, title='References')[0].content
        stratigraphies = artefact.stratigraphy_set.all
        return render(request, 'artefacts/collaboration_artefact_update.html', self.get_context_data(artefact=artefact, form=form, object_section=object_section, description_section=description_section,
                                                             zone_section=zone_section, macroscopic_section=macroscopic_section,
                                                             sample_section=sample_section, analyses_performed=analyses_performed,
                                                             metal_section=metal_section, corrosion_section=corrosion_section,
                                                             synthesis_section=synthesis_section, conclusion_text=conclusion_text,
                                                             references_text=references_text, stratigraphies=stratigraphies,
                                                             tokenComments=dict(tokenDict), sectionComments=dict(sectionDict),
                                                             unreadCommentsField=unreadCommentsField, unreadCommentsSection=unreadCommentsSection,
                                                             user=user, node_base_url=settings.NODE_BASE_URL))

    def post(self, request, *args, **kwargs):
        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
        section_1 = Section.objects.get_or_create(order=1, artefact=artefact, section_category=SC_ARTEFACT, title='The object')[0]
        artefact.section_set.add(section_1)
        section_2 = Section.objects.get_or_create(order=2, artefact=artefact, section_category=SC_ARTEFACT, title='Description and visual observation')[0]
        section_2.complementary_information = request.POST['complementary_information']
        artefact.section_set.add(section_2)
        section_3 = Section.objects.get_or_create(order=3, artefact=artefact, section_category=SC_SAMPLE, title='Zones of the artefact submitted to visual observation and location of sampling areas')[0]
        artefact.section_set.add(section_3)
        section_4 = Section.objects.get_or_create(order=4, artefact=artefact, section_category=SC_SAMPLE, title='Macroscopic observation')[0]
        section_4.content = request.POST['macroscopic_text']
        artefact.section_set.add(section_4)
        section_5 = Section.objects.get_or_create(order=5, artefact=artefact, section_category=SC_SAMPLE, title='Sample')[0]
        section_5.complementary_information = request.POST['sample_complementary_information']
        # images sample
        artefact.section_set.add(section_5)
        section_6 = Section.objects.get_or_create(order=6, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Analyses and results')[0]
        section_6.content = request.POST['analyses_performed']
        artefact.section_set.add(section_6)
        section_7 = Section.objects.get_or_create(order=7, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Metal')[0]
        section_7.content = request.POST['metal_text']
        section_7.complementary_information = request.POST['metal_complementary_information']
        # images metal
        artefact.section_set.add(section_7)
        section_8 = Section.objects.get_or_create(order=8, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Corrosion layers')[0]
        section_8.content = request.POST['corrosion_text']
        section_8.complementary_information = request.POST['corrosion_complementary_information']
        artefact.section_set.add(section_8)
        section_9 = Section.objects.get_or_create(order=9, artefact=artefact, section_category=SC_ANALYSIS_AND_RESULTS, title='Synthesis of the macroscopic / microscopic observation of corrosion layers')[0]
        section_9.content=request.POST['synthesis_text']
        artefact.section_set.add(section_9)
        section_10 = Section.objects.get_or_create(order=10, artefact=artefact, section_category=SC_CONCLUSION, title='Conclusion')[0]
        section_10.content = request.POST['conclusion_text']
        artefact.section_set.add(section_10)
        section_11 = Section.objects.get_or_create(order=11, artefact=artefact, section_category=SC_REFERENCES, title='References')[0]
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

        user = self.request.user
        errorAccessToken(self.kwargs['pk'], self.request.user)
        context = super(CollaborationCommentView, self).get_context_data(**kwargs)
        token = get_object_or_404(Token, pk=self.kwargs['pk'])
        artefact = token.artefact
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        stratigraphies = artefact.stratigraphy_set.all()

        if token.read == False :
            token.read = True
            token.save()

        sectionComments = []
        sectionDict = defaultdict(list)
        tokenComments = []
        tokenDict = defaultdict(list)
        token_type = ContentType.objects.get(model='token')
        unreadCommentsField = {}
        unreadCommentsSection = {}
        fields = Field.objects.all()
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
                if tokenComm.sent or user == tokenComm.user :
                    tokenComments.append(tokenComm)

            # Create a dictonary 'key-list' with field title as a key
            for tokenComment in tokenComments :
                tokenDict[tokenComment.field.title].append(tokenComment)

            # Research fields with unread comments
            for field in fields :
                unreadCommentsField[field.title] = False

            for tokenComment in tokenComments :
                if tokenComment.read == False and tokenComment.user != user :
                    unreadCommentsField[tokenComment.field.title] = True


        except :
            pass

        section_type = ContentType.objects.get(model='section')
        allSectionsComments = []

        for section in sections :
            # Get all comments from each section
            comments = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id=section.id, token_for_section_id = token.id)
            for comment in comments :
                allSectionsComments.append(comment)

            sectionShortTitle = getSectionShortName(section.title)
            unreadCommentsSection[sectionShortTitle] = False

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
                if commentSectionSorted.read == False and commentSectionSorted.user != user :
                    unreadCommentsSection[sectionShortTitle] = True


        context['user'] = user
        context['token'] = token
        context['artefact'] = artefact
        context['sections'] = sections
        context['documents'] = documents
        context['stratigraphies'] = stratigraphies
        context['unreadCommentsField'] = unreadCommentsField
        context['unreadCommentsSection'] = unreadCommentsSection
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

    def get_section_last_comment_id(self, section, model, token):
        lastId = 0
        try :
            commentsExisting = Collaboration_comment.objects.filter(content_type_id=model.id, object_model_id=section.id, token_for_section_id=token.id)
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

    def form_valid(self, form, **kwargs):

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
            field = getSectionCompleteName(self.kwargs['field'])
            section = Section.objects.get(title=field, artefact=token.artefact)
            form.instance.content_object = section
            form.instance.token_for_section = token
            section_type = ContentType.objects.get(model='section')

            if self.get_section_last_comment_id(section, section_type, token) != 0 :
                lastId = self.get_section_last_comment_id(section, section_type, token)
                form.instance.parent_id = lastId

            form.instance.token_for_section = token

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
        errorAccessToken(token_id, request.user)
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
                commentsSectionEach = Collaboration_comment.objects.filter(content_type_id=section_type.id, object_model_id=section.id, token_for_section_id=token.id)

                for comment in commentsSectionEach :
                    if comment.user == request.user and comment.sent == False:
                        comment.sent = True
                        comment.save()
        except:
            pass

        return redirect('artefacts:collaboration_menu')

class CommentReadView(generic.UpdateView):
    model = Token
    template_name_suffix = '_confirm_read'
    form_class = TokenHideForm

    def get_context_data(self, **kwargs):
        context = super(CommentReadView, self).get_context_data(**kwargs)
        token = Token.tokenManager.get(id=self.kwargs['pk'])
        errorAccessToken(self.kwargs['pk'], self.request.user)
        context['token'] = token
        return context

    def post(self, request, *args, **kwargs):
        token = Token.tokenManager.get(id=self.kwargs['pk'])
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
        sections = artefact.section_set.all()
        token_type = ContentType.objects.get(model='token')
        section_type = ContentType.objects.get(model='section')

        try:
            commentsTokenAll = Collaboration_comment.objects.filter(content_type_id=token_type.id,
                                                                    object_model_id=token.id)
            for comment in commentsTokenAll:
                if comment.user != request.user and comment.sent == True and comment.read == False:
                    comment.read = True
                    comment.save()
        except:
            pass

        try:
            for section in sections:
                commentsSectionEach = Collaboration_comment.objects.filter(content_type_id=section_type.id,
                                                                           object_model_id=section.id,
                                                                           token_for_section_id=token.id)

                for comment in commentsSectionEach:
                    if comment.user != request.user and comment.sent == True and comment.read == False:
                        comment.read = True
                        comment.save()
        except:
            pass

        return super(CommentReadView, self).post(request, **kwargs)

    def get_success_url(self):
        return reverse('artefacts:collaboration-comment', kwargs={'pk': self.kwargs['pk'], 'field': 'none'})

class CommentDeleteView(generic.DeleteView):
    model = Collaboration_comment
    template_name_suffix = '_confirm_delete'

    def get_context_data(self, **kwargs):

        context = super(CommentDeleteView, self).get_context_data(**kwargs)
        comment = get_object_or_404(Collaboration_comment, pk=self.kwargs['pk'])

        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        errorAccessToken(self.kwargs['token_id'], self.request.user)

        if token.read == False :
            token.read = True
            token.save()

        parent = 0
        child = 0

        try :
            parentComm = get_object_or_404(Collaboration_comment, pk=comment.parent_id)
            parent = parentComm.id
        except:
            pass

        try :
            childComm = get_object_or_404(Collaboration_comment, parent_id=comment.id)
            child = childComm.id
        except:
            pass

        context['token'] = token
        context['comment'] = comment
        context['parent_id'] = parent
        context['child_id'] = child
        return context

    def get_success_url(self):

        parent = 0
        child = 0
        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        try :
            parent = self.kwargs['parent_id']
        except:
            pass
        try :
            child = self.kwargs['child_id']
        except:
            pass

        if child!=0 :
            childComm = get_object_or_404(Collaboration_comment, pk=child)
            if parent!=0 :
                childComm.parent_id = parent
                childComm.save()

            else :
                childComm.parent_id = None
                childComm.save()

        return reverse('artefacts:collaboration-comment', kwargs={'pk': self.kwargs['token_id'], 'field': 'none'})

class CollaborationHideView(generic.UpdateView):
    model = Token
    template_name_suffix = '_collaboration_hide'
    form_class = TokenHideForm

    def post(self, request, *args, **kwargs):
        token = Token.tokenManager.get(id=self.kwargs['pk'])

        if token.user == self.request.user :
            token.hidden_by_author = True
            token.save()
        else:
            token.hidden_by_recipient = True
            token.save()

        return super(CollaborationHideView, self).post(request, **kwargs)

    def get_context_data(self, **kwargs):
        errorAccessToken(self.kwargs['pk'], self.request.user)
        context = super(CollaborationHideView, self).get_context_data(**kwargs)
        context['action'] = reverse('artefacts:collaboration-hide',
                                    kwargs={'pk': self.get_object().id})

        return context

    def get_success_url(self):
        return reverse('artefacts:collaboration_menu')

class CollaborationDeletedListView(generic.ListView):
    model = Token
    template_name_suffix = '_deleted_collaboration_menu'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(CollaborationDeletedListView, self).get_context_data(**kwargs)
        user = self.request.user

        # Add all the objects of the user in a variable
        allTokensShared = self.request.user.token_set.all().order_by('-modified')
        tokensShared = []
        tokensReceived = []

        # Research tokens shared by the user
        for token in allTokensShared :
            if token.right == 'W' and token.hidden_by_author :
                tokensShared.append(token)

        # Research tokens shared with the user
        try :
            tokens = Token.tokenManager.filter(recipient=user.email).order_by('-modified')
            for token in tokens :
                if token.right == 'W' and token.hidden_by_recipient :
                    tokensReceived.append(token)

        except :
            tokensReceived = []

        context['tokens_shared_by_me'] = tokensShared
        context['tokens_shared_with_me'] = tokensReceived
        context['user'] = user
        return context

def retrieveDeletedCollaboration(request, token_id) :
    token = get_object_or_404(Token, pk=token_id)
    errorAccessToken(token_id, request.user)

    if token.user == request.user :
        token.hidden_by_author = False
        token.save()

    else :
        token.hidden_by_recipient = False
        token.save()

    return redirect('artefacts:collaboration_deleted_menu')

class PublicationListView(generic.ListView):
    model = Publication

    template_name_suffix = '_menu'

    def get_context_data(self, **kwargs):

        context = super(PublicationListView, self).get_context_data(**kwargs)
        user = self.request.user
        isAdmin = False
        publicationsUser = []
        artefactsHistory = []
        newPubliHistory = 0

        # Get currents publications and publication history (decided)
        try :
            publications = Publication.objects.all().order_by('-modified')
            for publication in publications :
                if publication.artefact.object.user == user :
                    if publication.decision_taken :
                        artefactsHistory.append(publication)
                        if publication.read==False :
                            newPubliHistory=newPubliHistory + 1
        except :
            pass

        try :
            publications = Publication.objects.all().order_by('-created')
            for publication in publications :
                if publication.artefact.object.user == user :
                    if not publication.decision_taken :
                        publicationsUser.append(publication)
        except :
            pass

        artefactsPublished = []

        try :
            objects = user.object_set.all().order_by('name')

            for object in objects :
                artefacts = object.artefact_set.all().order_by('-modified')
                for artefact in artefacts :
                    if artefact.published :
                        artefactsPublished.append(artefact)
        except:
            pass

        try :
            groups = user.groups.all()
            for group in groups :
                if group.name == 'Main administrator' or group.name == 'Delegated administrator':
                    isAdmin = True
        except:
            pass

        context['isAdmin'] = isAdmin
        context['publications'] = publicationsUser
        context['artefactsPublished'] = artefactsPublished
        context['artefactsHistory'] = artefactsHistory
        context['user'] = user
        context['newPubliHistory'] = newPubliHistory
        return context

class PublicationArtefactDetailView(generic.DetailView):

    model = Publication
    template_name_suffix = '_detail'

    def get_context_data(self, **kwargs):

        context = super(PublicationArtefactDetailView, self).get_context_data(**kwargs)
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])
        artefact = publication.artefact
        typeUser = adminType(self.request.user)
        if artefact.object.user != self.request.user and typeUser==None :
            raise Http404
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        stratigraphies = artefact.stratigraphy_set.all()

        if publication.decision_taken and publication.read==False :
            publication.read = True
            publication.save()

        context['artefact'] = artefact
        context['publication'] = publication
        context['sections'] = sections
        context['documents'] = documents
        context['stratigraphies'] = stratigraphies
        context['node_base_url'] = settings.NODE_BASE_URL
        return context

class PublicationCreateView(generic.CreateView):
    model = Artefact
    template_name_suffix = '_publication_create'
    form_class = ArtefactsCreateForm

    def get_context_data(self, **kwargs):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        if artefact.object.user != self.request.user :
            raise Http404
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        stratigraphies = artefact.stratigraphy_set.all()
        user = self.request.user
        typeUser = adminType(user)

        context = super(PublicationCreateView, self).get_context_data(**kwargs)

        if typeUser == 'Main':
            context['admin'] = True
        else:
            context['admin'] = False

        context['artefact'] = artefact
        context['sections'] = sections
        context['documents'] = documents
        context['stratigraphies'] = stratigraphies
        context['user'] = user
        context['node_base_url'] = settings.NODE_BASE_URL

        return context

    def form_valid(self, form):
        artefact = Artefact.objects.get(pk=self.kwargs['pk'])
        artefact.parent_id = artefact.id
        artefact.pk = None
        form.instance = artefact
        form.save()
        return super(PublicationCreateView, self).form_valid(form)

    def get_success_url(self):
        artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
        sections = artefact.section_set.all()
        documents = artefact.document_set.all()
        stratigraphies = artefact.stratigraphy_set.all()
        authors = artefact.author.all()
        metX = artefact.metalx.all()
        childArtefacts = Artefact.objects.filter(parent_id=artefact.id).order_by('-modified')
        newArtefact = childArtefacts[0]

        for section in sections :
            images = section.image_set.all()
            section.pk = None
            section.artefact = newArtefact
            section.save()
            for image in images :
                image.pk = None
                image.section = section
                image.save()

        for auth in authors :
            newArtefact.author.add(auth)

        for met in metX :
            newArtefact.metalx.add(met)

        for document in documents :
            document.pk = None
            document.artefact = newArtefact
            document.save()

        for stratigraphie in stratigraphies :
            stratigraphie.pk = None
            stratigraphie.artefact = newArtefact
            stratigraphie.save()

        mainAdmins = []
        users = User.objects.all()
        isCurrentUserMainAdmin = False

        for user in users :
            groups = user.groups.all()
            for group in groups :
                if group.name=='Main administrator' :
                    mainAdmins.append(user)
                    if user==self.request.user :
                        isCurrentUserMainAdmin = True

        mainAdmin = mainAdmins[0]

        publication = Publication(artefact=newArtefact, user=mainAdmin)
        publication.save()

        if isCurrentUserMainAdmin == True :
            return reverse('artefacts:publication-administration-delegate', kwargs={'pk': publication.id})
        else :
            return reverse('users:detail', kwargs={'username': self.request.user})

class AdministrationListView(generic.ListView):
    model = Publication
    template_name_suffix = '_administration_menu'

    def get_context_data(self, **kwargs):

        context = super(AdministrationListView, self).get_context_data(**kwargs)
        user = self.request.user
        typeUser = adminType(user)

        if typeUser == 'Main' :
            try :
                requestsPubAll = Publication.objects.filter(user=user, delegated_user=None, decision_taken=False).order_by('-modified')
                requestsPub = []
                for publi in requestsPubAll :
                    if publi.artefact.object.user != user :
                        requestsPub.append(publi)
                context['requestsPub'] = requestsPub
                context['nbPubliReq'] = len(requestsPub)
            except:
                context['requestsPub'] = None
                context['nbPubliReq'] = 0

            try:
                delegPubConfirm = Publication.objects.filter(user=user, decision_taken=False).exclude(decision_delegated_user=None).order_by('-modified')
                context['delegPubConfirm'] = delegPubConfirm
                context['nbPubliConf'] = len(delegPubConfirm)
            except:
                context['delegPubConfirm'] = None
                context['nbPubliConf'] = 0

            try :
                delegPubProgress = Publication.objects.filter(user=user, decision_taken=False, decision_delegated_user=None).exclude(delegated_user=None).order_by('-modified')
                context['delegPubProgress'] = delegPubProgress
            except:
                context['delegPubProgress'] = None

        elif typeUser == 'Delegated' :
            try:
                delegPub = Publication.objects.filter(delegated_user=user, decision_taken=False, decision_delegated_user=None).order_by('-modified')
                context['delegPub'] = delegPub
                context['nbPubliDeleg'] = len(delegPub)
            except:
                context['delegPub'] = None
                context['nbPubliDeleg'] = 0
        else :
            raise Http404

        context['adminType'] = typeUser
        context['user'] = user
        return context

def accessAdministration(publication_id, user, accessType) :
    publication = get_object_or_404(Publication, pk=publication_id)

    if publication.decision_taken == True :
        raise Http404
    if accessType=='answermain' :
        if publication.user != user or publication.delegated_user != None :
            raise Http404
    elif accessType=='confirm' :
        if publication.user != user or publication.decision_delegated_user == None :
            raise Http404
    elif accessType=='answerdeleg' :
        if publication.delegated_user != user or publication.decision_delegated_user != None :
            raise Http404

class AdministrationArtefactDetailView(generic.DetailView):

    model = Publication
    template_name_suffix = '_administration_detail'

    """queryset = Artefact.objects.select_related('alloy', 'type', 'origin', 'recovering_date', 'chronology_period',
                                               'environment', 'location', 'owner', 'technology', 'sample_location',
                                               'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type')
"""
    def get_context_data(self, **kwargs):
        typeUser = adminType(self.request.user)
        if typeUser == None :
            raise Http404
        else :
            context = super(AdministrationArtefactDetailView, self).get_context_data(**kwargs)
            publication = get_object_or_404(Publication, pk=self.kwargs['pk'])

            accessAdministration(publication.id, self.request.user, self.kwargs['accessType'])

            artefact = publication.artefact
            sections = artefact.section_set.all()
            documents = artefact.document_set.all()
            stratigraphies = artefact.stratigraphy_set.all()

            context['publication'] = publication
            context['accessType'] = self.kwargs['accessType']
            context['artefact'] = artefact
            context['sections'] = sections
            context['documents'] = documents
            context['stratigraphies'] = stratigraphies
            context['node_base_url'] = settings.NODE_BASE_URL
            return context

def adminType(user) :
    adminType = None
    groups = user.groups.all()
    for group in groups:
        if group.name == 'Delegated administrator':
            adminType = 'Delegated'

    for group in groups:
        if group.name == 'Main administrator':
            adminType = 'Main'
    return adminType

class PublicationUpdateDecision(generic.UpdateView):

    model = Publication
    template_name_suffix = '_decision_form'
    form_class = PublicationDecisionForm

    def form_valid(self, form):
        self.object = form.save(commit=False)
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])

        user = self.request.user
        typeUser = adminType(user)

        # if main admin, change directly artefact status
        if typeUser=='Main':
            # Change validated attribut of the artefact
            if 'refuse' in self.request.POST :
                self.object.artefact.validated = False
            elif 'validate' in self.request.POST :
                self.object.artefact.validated = True
                # if validated, research eventual old published child of the same artefact to replace it
                try :
                    artefacts = Artefact.objects.filter(parent_id=self.object.artefact.parent_id)
                    for artefact in artefacts :
                        if artefact.published :
                            artefact.published = False
                            artefact.save()
                except :
                    pass
                # publish artefact
                self.object.artefact.published = True
            # save the artefact
            self.object.artefact.save()
            self.object.decision_taken = True
        # if delegated admin, change decision_delegated_user attribut value
        elif typeUser=='Delegated' and user==publication.delegated_user :
            if 'refuse' in self.request.POST :
                self.object.decision_delegated_user = False
            elif 'validate' in self.request.POST :
                self.object.decision_delegated_user = True
            self.object.comment_delegation = None
        else :
            raise Http404
        # save publication
        self.object.save()

        return super(PublicationUpdateDecision, self).form_valid(form)

    def get_context_data(self, **kwargs):
        user = self.request.user
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])
        typeAdmin = adminType(user)
        if typeAdmin==None :
            raise Http404
        if typeAdmin=='Delegated' :
            if user!=publication.delegated_user:
                raise Http404

        self.object = publication
        form_class = self.get_form_class()
        form = self.get_form(form_class)

        context = super(PublicationUpdateDecision, self).get_context_data(**kwargs)
        context['typeAdmin'] = typeAdmin
        context['form'] = form
        context['publication'] = publication

        return context

    def get_success_url(self):
        return reverse('artefacts:publication-administration-menu')

def confirmDecisionDelegatedAdmin(request, publication_id):
    if request.POST :
        user = request.user
        publication = get_object_or_404(Publication, pk=publication_id)
        typeAdmin = adminType(user)
        if typeAdmin=='Main' and publication.decision_delegated_user != None and publication.decision_taken == False :
            publication = get_object_or_404(Publication, pk=publication_id)
            artefact = publication.artefact
            if publication.decision_delegated_user == False :
                artefact.validated = False
            elif publication.decision_delegated_user == True :
                artefact.validated = True
                try :
                    artefacts = Artefact.objects.filter(parent_id = artefact.parent_id)
                    for art in artefacts:
                        if art.published :
                            art.published = False
                            art.save()
                except:
                    pass
                artefact.published = True
            else :
                raise Http404

            artefact.save()
            publication.decision_taken=True
            publication.save()

            return redirect('artefacts:publication-administration-menu')

class PublicationDecisionReject(generic.UpdateView) :
    model = Publication
    template_name_suffix = '_decision_reject'
    form_class = PublicationRejectDecisionForm

    def get_context_data(self, **kwargs):
        user = self.request.user
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])
        typeAdmin = adminType(user)

        if typeAdmin!='Main' :
            raise Http404
        else :
            self.object = publication
            form_class = self.get_form_class()
            form = self.get_form(form_class)

            context = super(PublicationDecisionReject, self).get_context_data(**kwargs)
            # context['typeAdmin'] = typeAdmin
            context['form'] = form
            context['publication'] = publication
            context['user'] = user

            return context

    def form_valid(self, form):
        typeUser = adminType(self.request.user)

        if typeUser != 'Main' :
            raise Http404
        else :
            self.object = form.save(commit=False)
            self.object.decision_delegated_user = None
            self.object.comment_to_user = None

            return super(PublicationDecisionReject, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:publication-administration-menu')

class PublicationDelegateView(generic.UpdateView):
    model = Publication
    template_name_suffix = '_delegate_form'
    form_class = PublicationDelegateForm

    def get_context_data(self, **kwargs):
        user = self.request.user
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])
        typeAdmin = adminType(user)
        if typeAdmin!='Main' :
            raise Http404
        else :
            self.object = publication
            form_class = self.get_form_class()
            form = self.get_form(form_class)

            context = super(PublicationDelegateView, self).get_context_data(**kwargs)
            # context['typeAdmin'] = typeAdmin
            context['form'] = form
            context['publication'] = publication
            context['user'] = user

            return context

    def form_valid(self, form):
        typeUser = adminType(self.request.user)
        if typeUser != 'Main' :
            raise Http404

        return super(PublicationDelegateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:publication-administration-menu')


from dal import autocomplete

from cities_light.models import City, Country, Region

class CityAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        # Don't forget to filter out results depending on the visitor !
        if not self.request.user.is_authenticated():
            return City.objects.none()

        qs = City.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs

class RegionAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        if not self.request.user.is_authenticated():
            return Region.objects.none()

        qs = Region.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs

class CountryAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        if not self.request.user.is_authenticated():
            return Country.objects.none()

        qs = Country.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs
class BaseAutocomplete(autocomplete.Select2QuerySetView):

    def get_queryset(self):
        if not self.request.user.is_authenticated():
            return self.model.objects.none()

        qs = self.model.objects.all()

        if self.q:
            qs = qs.filter(name__icontains=self.q)

        return qs

#class ChronologyPeriodAutoComplete(BaseAutocomplete):
#    model = ChronologyPeriod

class GenericAutoComplete(BaseAutocomplete):

    def get_queryset(self):
        model_class = getattr(models,self.kwargs['model'])

        if not self.request.user.is_authenticated():
            return model_class.objects.none()

        qs = model_class.objects.all()

        if self.q:
            qs = qs.filter(name__contains=self.q)

        return qs

