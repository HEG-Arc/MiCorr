# -*- coding: utf-8 -*-


from collections import defaultdict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic import DetailView, ListView, RedirectView, UpdateView
from django.contrib.contenttypes.models import ContentType
from django.views import generic
from django.conf import settings

from artefacts.models import Collaboration_comment, Publication, Token, Stratigraphy
from stratigraphies.micorrservice import MiCorrService

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
        stratigraphies = MiCorrService().getStratigraphiesByUser(self.request.user.id,stratigraphy_order_by)
        # Add stratigraphy information from django model
        pg_stratigraphies = Stratigraphy.objects.filter(uid__in=[s['uid'] for s in stratigraphies])
        stratigraphy_users = {self.request.user.id: self.request.user}
        for i, s in enumerate(stratigraphies):
            pg_s = pg_stratigraphies.filter(uid=s['uid']).first()
            s_user_id = int(s['user_uid'])
            if s_user_id in stratigraphy_users:
                s_user = stratigraphy_users[s_user_id]
            else:
                s_user = stratigraphy_users[s_user_id] = User.objects.get(pk=s_user_id)
            s['user'] = s_user
            if pg_s and pg_s.section and pg_s.section.artefact:
                s['origin'] = pg_s.section.artefact.origin
            else:
                s['origin'] = ''
        # Add all the objects of the user in a variable
        objects = self.request.user.object_set.all().order_by(artefact_order_by)
        token_type = ContentType.objects.get(model='token')
        section_type = ContentType.objects.get(model='section')
        artefacts_list = []
        objects_list = []
        published_artefact_for_object = {}
        new_publication_requests = 0

        # Add all artefacts card in a list
        for obj in objects :
            artefacts = obj.artefact_set.all().order_by('-modified')
            obj_dic = {'name': obj.name, 'modified': obj.modified, 'id':obj.id }
            published_artefact_for_object[obj.id] = False
            for artefact in artefacts :
                artefacts_list.append(artefact)
                # we take the first origin found in the list of object's artefact as object origin
                if artefact.origin and 'origin' not in obj_dic:
                    obj_dic['origin'] = artefact.origin
                if artefact.parent and artefact.validated :
                    published_artefact_for_object[obj.id] = True
            objects_list.append(obj_dic)

        # counting new tokens and comments sent
        new_comments_shared = 0
        for token in self.request.user.token_set.filter(right=Token.COMMENT, hidden_by_author=False):
            # add new comments on current token
            new_comments_shared += Collaboration_comment.objects.filter(content_type_id=token_type.id, object_model_id=token.id, sent=True, read=False).exclude(user=self.request.user).count()
            # add new comments on token's sections
            new_comments_shared += Collaboration_comment.objects.filter(content_type_id=section_type.id, token_for_section=token, sent=True, read=False).exclude(user=self.request.user).count()

        # counting new tokens and comments received
        new_tokens_received = Token.tokenManager.filter(recipient=self.request.user.email, hidden_by_recipient=False,
                                                        right=Token.COMMENT, read=False).count()

        # for token in Token.tokenManager.filter(recipient=self.request.user.email, hidden_by_recipient=False, right=Token.COMMENT) :
        #     # count new comments on token
        #     nb_new_token_comments = Collaboration_comment.objects.filter(content_type_id=token_type.id, object_model_id=token.id, sent=True, read=False).exclude(user=self.request.user).count()
        #     # add new comments on token's sections
        #     nb_new_token_comments += Collaboration_comment.objects.filter(content_type_id=section_type.id, token_for_section=token, sent=True, read=False).exclude(user=self.request.user).count()
        #
        #     if token.read == False :
        #         new_tokens_received += 1

        new_publications = Publication.objects.filter(decision_taken=True, read=False,
                                                                    artefact__object__user=self.request.user).count()

        user_admin_type = admin_type(self.request.user)
        if user_admin_type == 'Main':
            new_publication_requests = Publication.objects.filter(decision_taken=False, user=self.request.user,
                                                     delegated_user=None).exclude(
                artefact__object__user=self.request.user).count()
            # add confirmation requests
            new_publication_requests += Publication.objects.filter(decision_taken=False, user=self.request.user).exclude(
                decision_delegated_user=None).count()
        elif user_admin_type == 'Delegated' :
            new_publication_requests = Publication.objects.filter(decision_taken=False, delegated_user=self.request.user,
                                                     decision_delegated_user=None).count()

        context['published_artefact_for_object'] = published_artefact_for_object
        context['new_publications'] = new_publications
        context['new_publication_requests'] = new_publication_requests
        context['stratigraphies'] = stratigraphies
        context['observations'] = MiCorrService.getObservations()
        context['user'] = self.request.user
        context['user_admin_type'] = user_admin_type
        context['objects'] = objects_list
        context['artefacts'] = artefacts_list
        context['new_comments_shared'] = new_comments_shared
        context['new_tokens_received'] = new_tokens_received
        context['node_base_url'] = settings.NODE_BASE_URL
        return context

def admin_type(user) :
    if user.groups.filter(name='Main administrator').exists():
        return 'Main'
    elif user.groups.filter(name='Delegated administrator').exists():
        return 'Delegated'


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
