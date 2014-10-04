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
        payload = request.POST
        travis = payload #json.loads(urllib2.unquote(payload['payload']))
        logger.debug("Travis: %s" % travis)
        logger.debug("Message: %s" % travis['payload'][0]['message'])
        if request.META.get('HTTP_AUTHORIZATION') == sha256(settings.TRAVIS_REPO_SLUG + settings.TRAVIS_TOKEN).hexdigest():
            logger.debug("Authorization match!")
            # We store the build in the database
            # travis = TravisBuild()
            # travis.branch = payload['payload'][]
            # travis.commit = payload
            # travis.committer_name = payload
            # travis.number = payload
            # travis.type = payload
            # travis.message = payload
            # travis.save()
            # TODO: Use a worker to start the update process and update the status when done
        #logger.debug("Result: %s" % payload)
    else:
        logger.debug("Called outside a POST request")
        raise Http404
    return HttpResponse("OK - Thanks!", content_type="text/plain")
