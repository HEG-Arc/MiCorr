import json
from collections import defaultdict

from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from django.contrib.messages.views import SuccessMessageMixin
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.core.urlresolvers import reverse,resolve
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, Http404,HttpResponse, HttpResponseNotAllowed

from django.shortcuts import get_object_or_404, render, redirect

from django.utils.html import escape
from django.views import generic
from django.views.generic.base import ContextMixin
from haystack.forms import SearchForm
from django.conf import settings
from django.contrib import messages
from tinymce.widgets import TinyMCE

from contacts.forms import ContactCreateForm
from stratigraphies.micorrservice import MiCorrService
from users.models import User

from .forms import ArtefactsForm, ArtefactsCreateForm, DocumentUpdateForm, DocumentCreateForm, ArtefactFilter, \
    OriginCreateForm, AlloyCreateForm, TechnologyCreateForm, EnvironmentCreateForm, \
    MicrostructureCreateForm, CorrosionFormCreateForm, CorrosionTypeCreateForm, \
    RecoveringDateCreateForm, ImageCreateForm, TypeCreateForm, ContactAuthorForm, ShareArtefactForm, \
    ShareWithFriendForm, ObjectCreateForm, ObjectUpdateForm, CollaborationCommentForm, TokenHideForm, \
    PublicationDecisionForm, PublicationDelegateForm, PublicationRejectDecisionForm, StratigraphyCreateForm

from .models import Artefact, Document, Collaboration_comment, Field, Object, Section, Image, \
    Stratigraphy, Token, Publication, SectionTemplate
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


def searchStratigraphy(self):
    stratigraphy = MiCorrService().addStratigraphy("Search", "search")
    if stratigraphy:
        return redirect("/micorr/#/stratigraphy/" + stratigraphy)


class ArtefactsListView(generic.ListView):
    """
    A list of all the artefacts in the filter
    """
    queryset = Artefact.objects.filter(published=True).select_related('metal_e_1','alloy', 'type', 'object','origin__city','origin__city__region','origin__city__country',
                                               'chronology_category', 'technology','location__city','location__region')

    def get(self, request, *args, **kwargs):
        """
        Applies a filter to the artefacts list
        The user can make a full text search and/or a filter-based search
        """
        artefactssearch = SearchForm(request.GET)
        artefactsfilter = ArtefactFilter(request.GET, queryset=self.queryset)
        current_url = resolve(request.path_info).url_name
        if request.GET:
            searchresults = artefactssearch.search()
            # only return result on form submit not default get
            results = artefactsfilter.qs
            if request.GET.get('q'):
                results = results.filter(pk__in=[r.pk for r in searchresults])
        else:
            results = None
        return render(request, "artefacts/artefact_list.html",
                      {'current_url':current_url, 'search': artefactssearch, 'results': results, 'filter': artefactsfilter,
                       'self': self, 'node_base_url': settings.NODE_BASE_URL})

def get_section_groups(artefact, form, formObject,add_mce_widget=False):
    """
    Utility function shared by ArtefactDetailView and ArtefactUpdateView
    build a list of list of Section instances grouped by categories for the given artefact object
    associate actual form and fieldset with each group based on their name as saved in SectionTemplate records

    :param artefact: instance of Artefact
    :param form: instance of ArtefactsForm (FieldsetForm based)
    :param formObject: instance of ObjectUpdateForm
    :return: section_groups
    """
    # we group the sections by category
    # and associate corresponding form and fieldset with each group
    section_groups, group = [], []
    current_category = None
    for s in artefact.section_set.all():
        if current_category != s.template.section_category:
            if len(group):
                section_groups.append(group)
            current_category = s.template.section_category
            group = []
        group.append({'section': s, 'fieldset': form.get_fieldset(s.template.fieldset),
                      'form': formObject if s.template.fieldset == 'artefact' else form})
    if len(group):  # last group case
        section_groups.append(group)
    if add_mce_widget:
        # integrate with django_tinymce for content and complementary_information textareas
        # that are not rendered by TinyMCE widget and were missing tinymce class data-mce-conf attribute to be handled by
        # common tinmce_init . so we generate each data-mce-conf and add them to sections dict
        # they will be added to textarea elements in the template
        mce_widget = TinyMCE(mce_attrs={'mode': 'exact'})
        for sections in section_groups:
            for s in sections:
                s_order = s['section'].template.order
                if s['section'].template.has_content:
                    name = 's{}_content'.format(s_order)
                    s['content_mce_conf'] = json.dumps(
                        mce_widget.get_mce_config({'class': 'tinymce', 'id': name, 'name': name}))
                if s['section'].template.has_complementary_information:
                    name = 's{}_complementary_information'.format(s_order)
                    s['complementary_information_mce_conf'] = json.dumps(
                        mce_widget.get_mce_config({'class': 'tinymce', 'id': name, 'name': name}))

    return section_groups

class BaseArtefactContextMixin(ContextMixin):
    """
    ContextMixin creating common context_data for
    Artefact and Publication based views and templates
    """
    def get_context_data(self, **kwargs):
        context_data = super(BaseArtefactContextMixin, self).get_context_data(**kwargs)
        artefact_form = None
        add_mce_widget = False
        if self.object is None:
            if kwargs.get('token_id'):
                token = get_object_or_404(Token, pk=kwargs['token_id'])
                artefact = token.artefact
            elif self.kwargs.get('pk'):
                # CreatePublication case get artefact to copy in new Publication
                artefact = get_object_or_404(Artefact, pk=self.kwargs['pk'])
            else:
                raise Http404
        else:
            if isinstance(self.object,Artefact):
                artefact = self.object
                artefact_form = context_data.get('form')
                add_mce_widget = True
            else:
                # Publication case
                artefact = self.object.artefact
        context_data['artefact'] = artefact
        context_data['documents'] = artefact.document_set.all()
        artefact_form= artefact_form or ArtefactsForm(instance=artefact, label_suffix='')
        context_data['section_groups'] = get_section_groups(artefact, artefact_form,
                                                            ObjectUpdateForm(instance=artefact.object, label_suffix=''),
                                                            add_mce_widget)
        context_data['authors_fieldset'] = artefact_form.get_fieldset('authors')
        context_data['node_base_url'] = settings.NODE_BASE_URL
        return context_data

class ArtefactsDetailView(generic.DetailView, BaseArtefactContextMixin):
    """
    A detail view of a selected artefact
    """
    queryset = Artefact.objects.select_related('alloy', 'type', 'origin', 'recovering_date', 'chronology_category',
                                               'environment', 'location', 'owner', 'technology', 'sample_location',
                                               'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type')
    template_name = 'artefacts/artefact_update_page.html'
    def get_context_data(self, **kwargs):
        return super(ArtefactsDetailView, self).get_context_data(**kwargs)



class ArtefactsUpdateView(SuccessMessageMixin, generic.UpdateView):
    """
    A view which allows the user to edit an artefact
    When the editing is finished, it redirects the user to the artefact detail page
    """

    model = Artefact
    form_class = ArtefactsForm

    template_name_suffix = '_update_page'
    success_message = 'Your artefact has been saved successfully!'

    def get_context_data(self, **kwargs):
        context = super(ArtefactsUpdateView,self).get_context_data(**kwargs)

        #if user want to update an artefact with parent (= artefact for publication), raise 404
        errorUpdatePublicationArtefact(self.object)

        formObject = ObjectUpdateForm(instance=self.object.object)
        form=context['form']

        section_groups = get_section_groups(self.object, form, formObject,add_mce_widget=True)

        context.update(authors_fieldset=form.get_fieldset('authors'),
                       section_groups=section_groups,
                       node_base_url=settings.NODE_BASE_URL,
                       view='ArtefactsUpdateView')
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        artefact = self.object
        # Save updates for the object name (4 following lines)
        objForm = ObjectUpdateForm(request.POST, instance=artefact.object)
        if objForm.is_valid():
            objForm.save()
        # retrieve section related vars from POST
        for st in SectionTemplate.objects.filter(page_template=1).all():
            s_prefix = "s{}_".format(st.order)
            section_update = {k: request.POST.get(s_prefix+k, '') for k in ['content','complementary_information'] if getattr(st,"has_"+k)}
            section, created = Section.objects.update_or_create(artefact=artefact,template=st, defaults=section_update)
            if created:
                artefact.section_set.add(section)
        if request.is_ajax():
            form = self.get_form()
            if form.is_valid():
                self.object = form.save()
                return JsonResponse(dict(message='Artefact saved successfully'))
            else:
                return JsonResponse(dict(error='Error saving artefacts', errors=form.errors),status=422)
        else:
            return super(ArtefactsUpdateView, self).post(request, **kwargs)
    def get_success_url(self):
        return reverse('artefacts:artefact-update',args=[self.kwargs['pk']] )


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
        form.instance.user = self.request.user
        self.object = form.save()
        artefact = Artefact.objects.create(object=self.object)
        # add empty sections to new artefact based on default page template
        for st in SectionTemplate.objects.filter(page_template=1).all():
            artefact.section_set.create(artefact=artefact, template=st)
        return super(ObjectCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse('artefacts:artefact-update', kwargs={'pk': self.object.artefact_set.first().pk})

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
            except form.ValidationError as error:
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

    if request.user.is_superuser or request.user.has_perm('artefacts.change_artefact') or  (isArtefactOfConnectedUser(request, artefact_id)) or (getTokenRightByUuid(token_uuid) == 'W'):
        has_write_right = True
    return has_write_right


# Read right when :
# artefact.user = logged user
# token.right = 'R'
# artefact was validated by a micorr admin
def hasReadRight(request, artefact_id, token_uuid):
    has_write_right = False
    if request.user.is_superuser or request.user.has_perm('artefacts.change_artefact') or ('foo.view_bar')or isArtefactOfConnectedUser(request, artefact_id) or getTokenRightByUuid(token_uuid) == 'R' or isValidatedById(artefact_id):
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
    stratigraphies = MiCorrService().getStratigraphiesByUser(request.user.id)
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

def errorUpdatePublicationArtefact(artefact):
    if artefact.parent :
        raise Http404

def errorAccessToken(token, user):
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

class CollaborationUpdateView(ArtefactsUpdateView): #BaseArtefactContextMixin

    template_name = 'artefacts/collaboration_comment_artefact_update.html'

    def get_object(self, queryset=None):
        token = Token.tokenManager.get(id=self.kwargs['token_id'])
        obj = Artefact.objects.get(id=token.artefact.id)
        return obj

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super(CollaborationUpdateView, self).get_context_data(**self.kwargs)
        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        errorAccessToken(token, user)
        section_comments = Collaboration_comment.objects.filter(content_type=ContentType.objects.get(model='section'),
                                                    token_for_section_id=token.pk).filter(Q(user=user) | Q(sent=True))
        field_comments =  defaultdict(list)

        for comment in section_comments.filter(parent_id__isnull=True): #, field_name__isnull=False):
            # get the first comment for each field (it has no parent comment)
            while True:
                if comment.field_name:
                    field_comments[comment.field_name].append(comment)
                else:
                    field_comments[comment.object_model_id].append(comment)
                try:
                    # then add "replies" if any
                    comment=section_comments.get(parent_id=comment.id)
                except Collaboration_comment.DoesNotExist:
                    break

        if token.read == False :
            token.read = True
            token.save()

        context['user'] = user
        context['token'] = token
        context['field_comments'] = field_comments
        context['comment_form'] = self.get_form(CollaborationCommentForm)
        return context


    def get_success_url(self):
        return reverse('artefacts:collaboration-update',args=[self.kwargs['token_id']] )

class CollaborationCommentView(generic.CreateView,BaseArtefactContextMixin):

    model = Collaboration_comment
    template_name = 'artefacts/collaboration_comment_artefact_detail.html'
    form_class = CollaborationCommentForm

    """
    A detail view of a selected artefact
    """
    queryset = Artefact.objects.select_related('alloy', 'type', 'origin', 'recovering_date', 'chronology_category',
                                               'environment', 'location', 'owner', 'technology', 'sample_location',
                                               'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type')


    def get_context_data(self, **kwargs):

        user = self.request.user
        context = super(CollaborationCommentView, self).get_context_data(**self.kwargs)
        token = get_object_or_404(Token, pk=self.kwargs['token_id'])
        errorAccessToken(token, user)
        section_comments = Collaboration_comment.objects.filter(content_type=ContentType.objects.get(model='section'),
                                                    token_for_section_id=token.pk).filter(Q(user=user) | Q(sent=True))
        field_comments =  defaultdict(list)

        for comment in section_comments.filter(parent_id__isnull=True): #, field_name__isnull=False):
            # get the first comment for each field (it has no parent comment)
            while True:
                if comment.field_name:
                    field_comments[comment.field_name].append(comment)
                else:
                    field_comments[comment.object_model_id].append(comment)
                try:
                    # then add "replies" if any
                    comment=section_comments.get(parent_id=comment.id)
                except Collaboration_comment.DoesNotExist:
                    break

        if token.read == False :
            token.read = True
            token.save()


        context['user'] = user
        context['token'] = token
        context['field_comments'] = field_comments
        context['comment_form'] = context.pop('form')
        context['object']=context['artefact']
        return context

    def get_field_last_comment_id(self, token, field, model):
        lastId = None
        try :
            commentsExisting = Collaboration_comment.objects.filter(content_type_id=model.id, object_model_id=token.id, field_id=field.id)
            if commentsExisting:
                lastId = None
                idComm = None
                for comment in commentsExisting:
                    if not comment.parent:
                        idComm = comment.id

                while lastId is None:
                    isFound = False
                    for comment in commentsExisting:
                        if comment.parent_id == idComm:
                            idComm = comment.id
                            isFound = True
                    if not isFound:
                        lastId = idComm
            return lastId
        except :
            return None

    def get_section_last_comment_id(self, section, model, token):
        lastId = None
        try :
            commentsExisting = Collaboration_comment.objects.filter(content_type_id=model.id, object_model_id=section.id, token_for_section_id=token.id)
            if commentsExisting:
                lastId = None
                idComm = None
                for comment in commentsExisting:
                    if not comment.parent:
                        idComm = comment.id

                while lastId is None:
                    isFound = False
                    for comment in commentsExisting:
                        if comment.parent_id == idComm:
                            idComm = comment.id
                            isFound = True
                    if not isFound:
                        lastId = idComm
            return lastId
        except :
            return None

    def form_valid(self, form, **kwargs):

        token = Token.tokenManager.get(pk=self.kwargs['token_id'])
        section = Section.objects.get(pk=self.kwargs['section_id'])
        form.instance.field_name = self.kwargs['field']
        form.instance.fieldset_name = section.template.fieldset

        form.instance.content_object = section
        form.instance.token_for_section = token
        section_type = ContentType.objects.get(model='section')

        form.instance.parent_id = self.get_section_last_comment_id(section, section_type, token)

        form.instance.user = self.request.user

        return super(CollaborationCommentView, self).form_valid(form)


    def get_success_url(self):

        return reverse('artefacts:collaboration-comment', kwargs={'token_id' : self.kwargs['token_id']})


def sendComments(request, token_id) :
    if request.method == 'POST':
        token = get_object_or_404(Token, pk=token_id)
        errorAccessToken(token, request.user)
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
        sections = artefact.section_set.all()
        section_type = ContentType.objects.get(model='section')

        unsent_comments = Collaboration_comment.objects.filter(content_type_id=section_type.id,
                                                               token_for_section_id=token.id,
                                                               object_model_id__in=sections.values('pk'),
                                                               sent=False, user=request.user)
        unsent_comments.update(sent=True)

        return redirect('artefacts:collaboration-menu')

class CommentReadView(generic.UpdateView):
    model = Token
    template_name_suffix = '_confirm_read'
    form_class = TokenHideForm

    def get_context_data(self, **kwargs):
        context = super(CommentReadView, self).get_context_data(**kwargs)
        token = self.object
        errorAccessToken(token, self.request.user)
        context['token'] = token
        return context

    def post(self, request, *args, **kwargs):
        token = Token.tokenManager.get(id=self.kwargs['pk'])
        artefact = get_object_or_404(Artefact, pk=token.artefact.id)
        sections = artefact.section_set.all()
        token_type = ContentType.objects.get(model='token')
        section_type = ContentType.objects.get(model='section')

        Collaboration_comment.objects.exclude(user_id=request.user.id).filter(
            content_type_id=section_type.id, object_model_id__in=sections.values('pk'),
            token_for_section_id=token.id,
            sent=True, read=False).update(**dict(read=True))


        return super(CommentReadView, self).post(request, **kwargs)

    def get_success_url(self):
        return reverse('artefacts:collaboration-comment', kwargs={'token_id': self.kwargs['pk']})

class CommentDeleteView(generic.DeleteView):
    model = Collaboration_comment
    template_name_suffix = '_confirm_delete'

    def get_context_data(self, **kwargs):

        context = super(CommentDeleteView, self).get_context_data(**kwargs)
        comment = self.object
        token = comment.token_for_section
        errorAccessToken(token, self.request.user)

        if token.read == False :
            token.read = True
            token.save()

        context['token'] = token
        context['comment'] = comment
        return context

    def get_success_url(self):
        return reverse('artefacts:collaboration-comment', kwargs={'token_id': self.object.token_for_section.pk})

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
        context = super(CollaborationHideView, self).get_context_data(**kwargs)
        errorAccessToken(self.object, self.request.user)
        context['action'] = reverse('artefacts:collaboration-hide',
                                    kwargs={'pk': self.object.pk})

        return context

    def get_success_url(self):
        return reverse('artefacts:collaboration-menu')

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
    errorAccessToken(token, request.user)

    if token.user == request.user :
        token.hidden_by_author = False
        token.save()

    else :
        token.hidden_by_recipient = False
        token.save()

    return redirect('artefacts:collaboration-deleted-menu')

class PublicationListView(generic.ListView):
    model = Publication

    template_name_suffix = '_menu'

    def get_context_data(self, **kwargs):

        context = super(PublicationListView, self).get_context_data(**kwargs)
        user = self.request.user

        # Get currents publications and publication history (decided)

        user_publications = Publication.objects.filter(artefact__object__user=user)
        artefactsHistory = list(user_publications.filter(decision_taken=True).order_by('-modified'))
        newPubliHistory = sum(p.read==False for p in artefactsHistory)

        publicationsUser = user_publications.filter(decision_taken=False).order_by('-created')

        artefactsPublished = Artefact.objects.filter(published=True, object__user=user).order_by('object__name', '-modified')

        context['isAdmin'] = user.groups.filter(name__in=['Main administrator','Delegated administrator']).exists()
        context['publications'] = publicationsUser
        context['artefactsPublished'] = artefactsPublished
        context['artefactsHistory'] = artefactsHistory
        context['user'] = user
        context['newPubliHistory'] = newPubliHistory
        return context

class PublicationArtefactDetailView(generic.DetailView, BaseArtefactContextMixin):

    model = Publication
    template_name_suffix = '_detail'

    def get_context_data(self, **kwargs):

        context = super(PublicationArtefactDetailView, self).get_context_data(**kwargs)
        publication = self.object
        artefact = publication.artefact
        admin_user_type = admin_type(self.request.user)
        if artefact.object.user != self.request.user and admin_user_type==None :
            raise Http404

        if publication.decision_taken and publication.read==False :
            publication.read = True
            publication.save()

        context['publication'] = publication
        return context

class PublicationCreateView(generic.CreateView, BaseArtefactContextMixin):
    model = Artefact
    template_name_suffix = '_publication_create'
    form_class = ArtefactsCreateForm

    def get_context_data(self, **kwargs):
        context = super(PublicationCreateView, self).get_context_data(**kwargs)
        artefact = context.get('artefact')
        if not artefact or artefact.object.user != self.request.user:
            raise Http404

        context['user'] = self.request.user
        context['admin_user_type'] = admin_type(self.request.user)

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
        childArtefacts = Artefact.objects.filter(parent_id=artefact.id).order_by('-modified')
        newArtefact = childArtefacts[0]

        for section in sections :
            images = section.image_set.all()
            stratigraphies = section.stratigraphy_set.all()
            section.pk = None
            section.artefact = newArtefact
            section.save()
            for image in images :
                image.pk = None
                image.section = section
                image.save()
            for stratigraphy in stratigraphies:
                stratigraphy.pk = None
                stratigraphy.section = section
                stratigraphy.save()

        if artefact.author.exists():
            newArtefact.author.add(*artefact.author.all())
        if artefact.metal_e_x.exists():
            newArtefact.metal_e_x.add(*artefact.metal_e_x.all())

        for document in documents :
            document.pk = None
            document.artefact = newArtefact
            document.save()


        main_administrator = Group.objects.get(name='Main administrator').user_set.first()

        publication = Publication(artefact=newArtefact, user=main_administrator)
        publication.save()

        if self.request.user == main_administrator:
            return reverse('artefacts:publication-administration-delegate', kwargs={'pk': publication.id})
        else :
            return reverse('users:detail', kwargs={'username': self.request.user})

class AdministrationListView(generic.ListView):
    model = Publication
    template_name_suffix = '_administration_menu'

    def get_context_data(self, **kwargs):

        context = super(AdministrationListView, self).get_context_data(**kwargs)
        user = self.request.user
        admin_user_type = admin_type(user)

        if admin_user_type == 'Main' :
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

        elif admin_user_type == 'Delegated' :
            try:
                delegPub = Publication.objects.filter(delegated_user=user, decision_taken=False, decision_delegated_user=None).order_by('-modified')
                context['delegPub'] = delegPub
                context['nbPubliDeleg'] = len(delegPub)
            except:
                context['delegPub'] = None
                context['nbPubliDeleg'] = 0
        else :
            raise Http404

        context['admin_user_type'] = admin_user_type
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

class AdministrationArtefactDetailView(generic.DetailView, BaseArtefactContextMixin):

    model = Publication
    template_name_suffix = '_administration_detail'

    """queryset = Artefact.objects.select_related('alloy', 'type', 'origin', 'recovering_date', 'chronology_category',
                                               'environment', 'location', 'owner', 'technology', 'sample_location',
                                               'responsible_institution', 'microstructure', 'corrosion_form', 'corrosion_type')
"""
    def get_context_data(self, **kwargs):
        admin_user_type = admin_type(self.request.user)
        if admin_user_type == None :
            raise Http404
        else :
            context = super(AdministrationArtefactDetailView, self).get_context_data(**kwargs)
            publication = self.object

            accessAdministration(publication.id, self.request.user, self.kwargs['accessType'])

            context['publication'] = publication
            context['accessType'] = self.kwargs['accessType']
            return context

def admin_type(user) :
    groups = user.groups.values_list('name', flat=True)
    if 'Main administrator' in groups:
        return 'Main'
    elif 'Delegated administrator' in groups:
            return 'Delegated'


class PublicationUpdateDecision(generic.UpdateView):

    model = Publication
    template_name_suffix = '_decision_form'
    form_class = PublicationDecisionForm

    def form_valid(self, form):
        self.object = form.save(commit=False)
        publication = get_object_or_404(Publication, pk=self.kwargs['pk'])

        user = self.request.user
        admin_user_type = admin_type(user)

        # if main admin, change directly artefact status
        if admin_user_type=='Main':
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
        elif admin_user_type=='Delegated' and user==publication.delegated_user :
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
        typeAdmin = admin_type(user)
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
        typeAdmin = admin_type(user)
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
        typeAdmin = admin_type(user)

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
        admin_user_type = admin_type(self.request.user)

        if admin_user_type != 'Main' :
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
        admin_user_type = admin_type(user)
        if admin_user_type!='Main' :
            raise Http404
        else :
            self.object = publication
            form_class = self.get_form_class()
            form = self.get_form(form_class)

            context = super(PublicationDelegateView, self).get_context_data(**kwargs)
            context['form'] = form
            context['publication'] = publication
            context['user'] = user

            return context

    def form_valid(self, form):
        admin_user_type = admin_type(self.request.user)
        if admin_user_type != 'Main' :
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


class GenericAutoComplete(autocomplete.Select2QuerySetView):

    default_search_field = 'name'

    def get_queryset(self):
        model_class = getattr(models,self.kwargs['model'])

        if not self.request.user.is_authenticated():
            return model_class.objects.none()

        qs = model_class.objects.all()

        if self.q:
            qs=self.filter_queryset(qs)

        return qs

    def filter_queryset(self, qs):
        search_field = self.create_field or self.default_search_field
        return qs.filter(**{search_field + '__icontains': self.q})

    # post overloading is required to add support for Create option
    # as Base class method (BaseQuerySetView.post) does not accept any args / kwargs
    # so would break with our extra model kwargs passed
    def post(self, request, *args, **kwargs):

        return super(GenericAutoComplete, self).post(request)

class ContactAutoComplete(GenericAutoComplete):

    def filter_queryset(self, qs):
        return qs.filter(Q(name__icontains=self.q)|Q(surname__icontains=self.q)|Q(organization_name__icontains=self.q))

class OriginAutoComplete(GenericAutoComplete):

    def filter_queryset(self, qs):
        return qs.filter(Q(site__icontains=self.q)|Q(city__name__icontains=self.q)|Q(city__country__name__icontains=self.q))


class ElementAutoCompleteFromList(GenericAutoComplete):

    def filter_queryset(self, qs):
        return qs.filter(Q(symbol__icontains=self.q) | Q(name__icontains=self.q))

    def get_result_label(self, result):
        return '{} {}'.format(result.symbol, result.name)

    def get_selected_result_label(self, result):
        return str(result)
