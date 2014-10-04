# -*- coding: UTF-8 -*-
# views.py
#
# Copyright (C) 2014 HES-SO//HEG Arc
#
# Author(s): Cédric Gaspoz <cedric.gaspoz@he-arc.ch>
#
# This file is part of MiCorr.
#
# MiCorr is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# MiCorr is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with MiCorr. If not, see <http://www.gnu.org/licenses/>.

# Stdlib imports
from hashlib import sha256
import json
import logging
import urllib2

# Core Django imports
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.http import Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Third-party app imports

# MiCorr imports
from .models import TravisBuild

logger = logging.getLogger(__name__)


@csrf_exempt
def pull(request):
    if request.POST:
        travis = json.loads(request.POST['payload'])
        logger.debug("JSON: %s" % travis)
        if request.META.get('HTTP_AUTHORIZATION') == sha256(settings.TRAVIS_REPO_SLUG + settings.TRAVIS_TOKEN).hexdigest():
            logger.debug("Authorization match!")
            # We store the build in the database
            pull = TravisBuild()
            pull.branch = travis['branch']
            pull.commit = travis['commit']
            pull.committer_name = travis['committer_name']
            pull.number = travis['number']
            pull.type = travis['type']
            pull.message = travis['message']
            pull.save()
            # TODO: Use a worker to start the update process and update the status when done
            import subprocess
            r = subprocess.call("/home/micorr/deploy.sh %s 1>/tmp/deploy.out 2>/tmp/deploy.error" % pull.id, shell=True)
            logger.debug("UPDATE result: %s" % r)
    else:
        logger.debug("Called outside a POST request")
        raise Http404
    return HttpResponse("OK - Thanks!", content_type="text/plain")


@csrf_exempt
def pull_update(request, pull_id):
    if request.POST:
        logger.debug("Request to update deployment: %s" % pull_id)
        pull = get_object_or_404(TravisBuild, pk=int(pull_id))
        logger.debug("We have the build: %s" % pull.number)
        pull.out = request.POST['out']
        pull.error = request.POST['error']
        pull.update_status = "Done"
        pull.save()
    else:
        logger.debug("Called outside a POST request")
        raise Http404
    return HttpResponse("OK - Thanks!", content_type="text/plain")