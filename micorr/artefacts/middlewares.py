# coding=utf-8
import re

from django.shortcuts import get_object_or_404

from artefacts.views import has_comment_right, has_read_right, has_write_right
from artefacts.views import send_first_use_of_token_email
from django.core.exceptions import PermissionDenied
from artefacts.models import Artefact
from django.utils.deprecation import MiddlewareMixin

class artefactAccessControlMiddleware(MiddlewareMixin):

    def process_view(self, request, view_func, view_args, view_kwargs):

        url = str(request.path)
        token_uuid = None

        # check if exist a token in the url
        if 'token' in request.GET:
            token_uuid = request.GET['token']
            request.session['token_uuid'] = str(token_uuid)

        # Check if READ RIGHT
        # If url like = '/artefacts/5/' (with or without token)
        pattern_read = re.compile('^\/artefacts\/[0-9]+\/$')
        # Check if EDIT RIGHT
        # If url like = '/artefacts/5/update/' (with or without token)
        pattern_update = re.compile('^\/artefacts\/[0-9]+\/update\/$')

        if pattern_read.match(url):
            artefact_id = int(view_kwargs.get('pk', None))
            artefact = get_object_or_404(Artefact, pk=artefact_id)
            if not artefact.published:
                if has_read_right(request, artefact, token_uuid):
                    if token_uuid:
                        send_first_use_of_token_email(token_uuid)
                else:
                    raise PermissionDenied
        elif pattern_update.match(url):
            # method POST after submit the update form
            if request.method == 'POST':
                if 'token_uuid' in request.session:
                    token_uuid = request.session['token_uuid']

            artefact_id = int(view_kwargs.get('pk', None))
            artefact = get_object_or_404(Artefact, pk=artefact_id)
            if has_write_right(request, artefact, token_uuid):
                if token_uuid != None:
                    send_first_use_of_token_email(token_uuid)
            else:
                raise PermissionDenied

