# coding=utf-8
import re


from artefacts.views import hasWriteRight, hasReadRight
from artefacts.views import sendFirstUseOfTokenEmail


class artefactAccessControlMiddleware:


    def process_view(self, request, view_func, view_args, view_kwargs):

        url = str(request.path)
        token_uuid = None
        has_write_right = False
        has_read_right = False

        # check if exist a token in the url
        if 'token' in request.GET:
            token_uuid = request.GET['token']


        # Check if READ RIGHT
        # If url like = '/artefacts/5/' (with or without token)
        pattern_read = re.compile('^\/artefacts\/[0-9]+\/$')
        if pattern_read.match(url):
            artefact_id = view_kwargs.get('pk', None)

            artefact_right = hasReadRight(request, artefact_id, token_uuid)
            if (artefact_right):
                has_read_right = True
                if token_uuid != None:
                    sendFirstUseOfTokenEmail(token_uuid)

            request.session['has_read_right'] = has_read_right

        # Check if WRITE RIGHT
        # If url like = '/artefacts/5/update/' (with or without token)
        pattern_update = re.compile('^\/artefacts\/[0-9]+\/update\/$')
        if pattern_update.match(url):
            artefact_id = view_kwargs.get('pk', None)

            artefact_right = hasWriteRight(request, artefact_id, token_uuid)
            if (artefact_right):
                has_write_right = True
                if token_uuid != None:
                    sendFirstUseOfTokenEmail(token_uuid)

            request.session['has_write_right'] = has_write_right


    def process_request(self, request):
        print("Hey, on a reçu une requete !")
        # on est pas obligé de retourner quoi que ce soit

    def process_response(self, request, response):
        print("Hey, on a repondu a une requete !")
        # return obligatoire
        return response
