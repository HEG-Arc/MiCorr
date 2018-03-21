# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from collections import defaultdict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.views.generic import DetailView, ListView, RedirectView, UpdateView
from django.contrib.contenttypes.models import ContentType
from django.views import generic
from django.conf import settings

from artefacts.models import Collaboration_comment, Publication, Token, Stratigraphy
from stratigraphies.neo4jdao import Neo4jDAO

from django.contrib.contenttypes.models import ContentType
from users.models import User

class UserDetailView(LoginRequiredMixin, generic.DetailView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(UserDetailView, self).get_context_data(**kwargs)
        # Add the stratigraphies of the user
        stratigraphy_order_by=self.request.GET.get('stratigraphy_order_by', 'description')
        artefact_order_by=self.request.GET.get('artefact_order_by', 'name')
        stratigraphies = Neo4jDAO().getStratigraphiesByUser(self.request.user.id,stratigraphy_order_by)
        # Add stratigraphy information from django model
        pg_stratigraphies = Stratigraphy.objects.filter(uid__in=[s['uid'] for s in stratigraphies])
        for i, s in enumerate(stratigraphies):
            pg_s = pg_stratigraphies.filter(uid=s['uid']).first()
            if pg_s:
                s['origin'] = pg_s.artefact.origin

        # Add all the objects of the user in a variable
        objects = self.request.user.object_set.all().order_by(artefact_order_by)
        tokenType = ContentType.objects.get(model='token')
        sectionType = ContentType.objects.get(model='section')
        artefactsList = []
        objectsList = []
        isTherePubValArtForObj = {}
        newComments = 0
        newTokens = 0
        newPubliHistory = 0
        newRequests = 0
        for obj in objects :
            isTherePubValArtForObj[obj.id] = False

        # Add all artefacts card in a list
        for obj in objects :
            artefacts = obj.artefact_set.all().order_by('-modified')
            obj_dic = {'name': obj.name, 'modified': obj.modified, 'id':obj.id }
            for artefact in artefacts :
                artefactsList.append(artefact)
                # we take the first origin found in the list of object's artefact as object origin
                if artefact.origin and 'origin' not in obj_dic:
                    obj_dic['origin'] = artefact.origin
                if artefact.parent and artefact.validated :
                    isTherePubValArtForObj[obj.id] = True
            objectsList.append(obj_dic)

        try:
            allSharedToken = Token.tokenManager.filter(user=self.request.user, hidden_by_author=False, right='W')
            for token in allSharedToken :
                allCommTokenField = Collaboration_comment.objects.filter(content_type_id=tokenType.id, object_model_id=token.id)
                allCommTokenSection = Collaboration_comment.objects.filter(content_type_id=sectionType.id, token_for_section=token.id)
                for comm in allCommTokenField :
                    if comm.user != self.request.user and comm.sent == True and comm.read == False :
                        newComments = newComments + 1

                for comm in allCommTokenSection :
                    if comm.user != self.request.user and comm.sent == True and comm.read == False :
                        newComments = newComments + 1
        except:
            pass

        try:
            allReceivedToken = Token.tokenManager.filter(recipient=self.request.user.email, hidden_by_recipient=False, right='W')
            for token in allReceivedToken :
                allCommTokenField = Collaboration_comment.objects.filter(content_type_id=tokenType.id, object_model_id=token.id)
                allCommTokenSection = Collaboration_comment.objects.filter(content_type_id=sectionType.id, token_for_section=token.id)
                for comm in allCommTokenField:
                    if comm.user != self.request.user and comm.sent == True and comm.read == False:
                        newComments = newComments + 1

                for comm in allCommTokenSection:
                    if comm.user != self.request.user and comm.sent == True and comm.read == False:
                        newComments = newComments + 1
                if token.read == False :
                    newTokens = newTokens + 1
        except:
            pass

        try:
            publications = Publication.objects.filter(decision_taken = True, read=False)
            for publication in publications:
                if publication.artefact.object.user == self.request.user :
                    newPubliHistory = newPubliHistory + 1
        except:
            pass

        userType = adminType(self.request.user)
        if userType == 'Main':
            try :
                publiReq = Publication.objects.filter(decision_taken=False, user=self.request.user, delegated_user=None)
                newRequests = newRequests + len(publiReq)
                for publi in publiReq :
                    if publi.artefact.object.user == self.request.user :
                        newRequests = newRequests - 1
            except:
                pass

            try :
                publiConf = Publication.objects.filter(decision_taken=False, user=self.request.user).exclude(decision_delegated_user=None)
                newRequests = newRequests + len(publiConf)
            except:
                pass
        elif userType == 'Delegated' :
            try :
                publiDeleg = Publication.objects.filter(decision_taken=False, delegated_user=self.request.user, decision_delegated_user=None)
                newRequests = newRequests + len(publiDeleg)
            except:
                pass

        context['pubValArtForObj'] = isTherePubValArtForObj
        context['newPubliHistory'] = newPubliHistory
        context['newRequests'] = newRequests
        context['stratigraphies'] = stratigraphies
        context['userType'] = userType
        context['objects'] = objectsList
        context['artefacts'] = artefactsList
        context['newComments'] = newComments
        context['newTokens'] = newTokens
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


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse('users:detail',
                       kwargs={'username': self.request.user.username})


class UserUpdateView(LoginRequiredMixin, UpdateView):

    fields = ['name', ]

    # we already imported User in the view code above, remember?
    model = User

    # send the user back to their own page after a successful update
    def get_success_url(self):
        return reverse('users:detail',
                       kwargs={'username': self.request.user.username})

    def get_object(self):
        # Only get the User record for the user making the request
        return User.objects.get(username=self.request.user.username)


class UserListView(LoginRequiredMixin, ListView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'
