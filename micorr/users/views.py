# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from collections import defaultdict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.views.generic import DetailView, ListView, RedirectView, UpdateView
from django.contrib.contenttypes.models import ContentType
from django.views import generic
from django.conf import settings

from artefacts.models import Collaboration_comment, Publication, Token
from stratigraphies.neo4jdao import Neo4jDAO

from django.contrib.contenttypes.models import ContentType
from .models import User


class UserDetailView(generic.DetailView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(UserDetailView, self).get_context_data(**kwargs)
        # Add the stratigraphies of the user
        stratigraphies = Neo4jDAO().getStratigraphiesByUser(self.request.user.id)
        # Add all the objects of the user in a variable
        objects = self.request.user.object_set.all().order_by('name')
        tokenType = ContentType.objects.get(model='token')
        sectionType = ContentType.objects.get(model='section')
        artefactsList = []
        isTherePubValArtForObj = {}
        newComments = 0

        for obj in objects :
            isTherePubValArtForObj[obj.id] = False

        # Add all artefacts card in a list
        for obj in objects :
            artefacts = obj.artefact_set.all().order_by('-modified')
            for artefact in artefacts :
                artefactsList.append(artefact)
                if artefact.parent and artefact.validated :
                    isTherePubValArtForObj[obj.id] = True

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
        except:
            pass

        context['pubValArtForObj'] = isTherePubValArtForObj
        context['stratigraphies'] = stratigraphies
        context['objects'] = objects
        context['artefacts'] = artefactsList
        context['newComments'] = newComments
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
