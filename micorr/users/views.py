# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from collections import defaultdict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.views.generic import DetailView, ListView, RedirectView, UpdateView
from django.views import generic
from django.conf import settings

from stratigraphies.neo4jdao import Neo4jDAO
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
        objects = self.request.user.object_set.all().order_by('created')
        list1 = []

        # Add all artefacts card in a list
        for obj in objects :
            artefacts = obj.artefact_set.all()
            for artefact in artefacts :
                list1.append(artefact)



        context['stratigraphies'] = stratigraphies
        context['objects'] = objects
        context['artefacts'] = list1
        context['node_base_url'] = settings.NODE_BASE_URL
        return context



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

class CollaborationDetailView(LoginRequiredMixin, ListView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'

    template_name_suffix = '_collaboration_menu'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(CollaborationDetailView, self).get_context_data(**kwargs)

        # Add all the objects of the user in a variable
        allTokens = self.request.user.token_set.all().order_by('created')
        artefacts = []

        # Add artefacts card collaborated in a list
        for token in allTokens :
            if token.right == 'W':
                artefacts.append(token.artefact)

        context['artefacts_collaboration'] = artefacts
        context['node_base_url'] = settings.NODE_BASE_URL
        return context
