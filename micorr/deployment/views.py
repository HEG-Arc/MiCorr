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

# Core Django imports
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.http import Http404, HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Third-party app imports
from configurations import Configuration

# MiCorr imports

logger = logging.getLogger(__name__)
#sha256('username/repository' + Configuration.TRAVIS_TOKEN).hexdigest()


@csrf_exempt
def pull(request):
    if request.POST:
        #travis = json.loads(request.body)
        logger.debug("PAYLOAD\n%s" % request.POST['payload'])
        logger.debug("HEADER\n%s" % request.META)
    else:
        logger.debug("Called outside a POST request")
        raise Http404
    return HttpResponse("OK - Thanks!", content_type="text/plain")
