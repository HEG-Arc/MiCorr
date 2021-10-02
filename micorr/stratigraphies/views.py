import simplejson as json
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ValidationError
from django.core.mail import send_mail, EmailMultiAlternatives
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import get_template
from django.urls import reverse
from django.views import View
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.gzip import gzip_page
from django.views.decorators.http import require_http_methods
from django.views.generic import FormView, TemplateView

from stratigraphies.micorrservice import MiCorrService
from users.models import User

from .models import NodeDescription
from .forms import StratigraphyDescriptionUpdateForm, ShareStratigraphyForm


#retourne la page d'accueil
def home(request):
    return render(request, 'stratigraphies/index.html', locals())


# Retourne tous les details d'une stratigraphie, characteristiques et interfaces
# @ params : stratigraphy nom de la stratigraphie
@cache_page(30)
@gzip_page
def getStratigraphyDetails(request, stratigraphy):
    ms = MiCorrService()
    return HttpResponse(json.dumps(ms.getStratigraphyDetails(stratigraphy)), content_type='application/json')

# retourne toutes les sous caracteristiques et sous caracteristiques
# @ params
@cache_page(24 * 60 * 60)
@gzip_page
def getallcharacteristic(request):
    ms = MiCorrService()
    return HttpResponse(json.dumps(ms.getAllCharacteristic()), content_type='application/json')

# retourne toutes les caracteristiques et sous caracteristiques
# @ params
def addStratigraphy(request, artefact, stratigraphy):
    ms = MiCorrService()
    # uuid = stratigraphy name when insert is successful or False otherwise
    uuid = ms.addStratigraphy(artefact, stratigraphy)
    if uuid:
        insert_status = True
    else:
        insert_status = False
    response = {"insertStatus": insert_status}
    return HttpResponse(json.dumps(response), content_type='application/json')

# Verifie si une stratigraphie existe deja
# @ params stratigraphy nom de la stratigraphie
def stratigraphyExists(request, stratigraphy):
    ms = MiCorrService()
    exists = {"StratigraphyExists" : ms.stratigraphyExists(stratigraphy)}
    return HttpResponse(json.dumps(exists), content_type='application/json')

# retourne toutes les sous caracteristiques et sous caracteristiques
# @ params
def getStratigraphyByArtefact(request, artefact):
    ms = MiCorrService()
    strats = {'strats' : ms.getStratigraphyByArtefact(artefact)}
    return HttpResponse(json.dumps(strats), content_type='application/json')


def isauthenticated(request):
    return HttpResponse(json.dumps({'is_authenticated' : request.user.is_active}), content_type='application/json')

@csrf_exempt
def sendEmail(request):
    if request.method == 'POST':
        send_mail(
            'MiCorr saved Stratigraphy',
            'Here is your stratigraphy : ' + request.build_absolute_uri().split("email", 1)[0] + '#' + request.GET['stratigraphy'],
            'micorr@he-arc.ch',
            [request.GET['email']],
            fail_silently=False,
        )
    return HttpResponse('Email sent!')

# retourne la liste de tous les artefacts
# @ params
def getallartefacts(request):
    ms = MiCorrService()
    artefacts = {'artefacts' : ms.getAllArtefacts()}
    return HttpResponse(json.dumps(artefacts), content_type='application/json')


@csrf_exempt
def update_stratigraphy_description(request, stratigraphy):
    ms = MiCorrService()
    if request.method == 'POST':
        if ms.stratigraphyExists(stratigraphy):  # True/False
            form = StratigraphyDescriptionUpdateForm(request.POST)
            if form.is_valid():
                if form.cleaned_data['attribute'] == 'description':
                    ms.updateStratigraphyDescription(stratigraphy, form.cleaned_data['value'])
                    return HttpResponse(form.cleaned_data['value'])
                else:
                    return HttpResponse('Only the description can be edited!')
            else:
                return HttpResponse('Form is not valid! %s' % form.errors)
        else:
            return HttpResponse('No stratigraphy exists with that UID')
    else:
        return HttpResponse('Only POST is allowed!')


@csrf_exempt
@login_required
def delete_stratigraphy_user(request, stratigraphy):
    ms = MiCorrService()
    user_id = ms.getStratigraphyUser(stratigraphy)
    if user_id:
        if user_id == request.user.id:
            # We remove the property
            ms.delStratigraphyUser(stratigraphy)
            messages.success(request, 'The stratigraphy was deleted!')
            return redirect('users:detail', request.user.username)
    messages.warning(request, 'Unable to delete the stratigraphy!')
    return redirect('users:detail', request.user.username)


class ShareCreateView(LoginRequiredMixin, FormView):
    form_class = ShareStratigraphyForm
    template_name = 'stratigraphies/share_stratigraphy_form.html'

    def get_success_url(self):
        return reverse('stratigraphies:list-share', kwargs={'stratigraphy': self.request.resolver_match.kwargs.get('stratigraphy')})


    def form_valid(self, form):
            # This method is called when valid form data has been POSTed.
            # It should return an HttpResponse.
            subject = "Shared MiCorr stratigraphy : "
            recipient_email = form.user.email if form.user else form.cleaned_data['email']
            email_recipients = [recipient_email]
            comment = form.cleaned_data['comment']
            cc_myself = form.cleaned_data['cc_myself']
            user = self.request.user
            stratigraphy_uid = self.request.resolver_match.kwargs.get('stratigraphy')
            link = self.request.build_absolute_uri(f"/micorr/#/stratigraphy/{stratigraphy_uid}")

            ms = MiCorrService()
            ms.share_stratigraphy(self.request.user.id, stratigraphy_uid, form.user.id if form.user else None, form.cleaned_data['email'])

            # create text and html content to have a clickable link
            context = {'link':link, 'user':user}
            text_message = get_template('stratigraphies/email/stratigraphy_share.txt').render(context=context)
            html_message = get_template('stratigraphies/email/stratigraphy_share.html').render(context=context)
            if cc_myself:
                email_recipients.append(user.email)

            msg = EmailMultiAlternatives(subject, text_message, settings.DEFAULT_FROM_EMAIL, email_recipients, reply_to=(user.email,))
            msg.attach_alternative(html_message, "text/html")
            msg.send()

            # messages.add_message(request, messages.SUCCESS, 'New share added successfully')

            return super().form_valid(form)


class ShareDeleteView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        stratigraphy = kwargs.get('stratigraphy')
        recipient_user = get_object_or_404(User, pk=kwargs['user_id'])
        ms = MiCorrService()
        ms.delete_stratigraphy_share(self.request.user.id, stratigraphy, recipient_user.id)
        return HttpResponseRedirect(reverse('stratigraphies:list-share', kwargs={'stratigraphy': stratigraphy}))


class ShareListView(LoginRequiredMixin, TemplateView):

    template_name = "stratigraphies/share_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        ms = MiCorrService()
        shares = ms.get_all_shares(context['stratigraphy'])
        # check c ser state
        for share in shares:
            if share['user_id']:
                try:
                    user = User.objects.get(pk=share['user_id'])
                except User.DoesNotExist:
                    pass
                else:
                    share['email'] = user.email
            elif share['email']:
                try:
                    user = User.objects.get(email=share['email'])
                except User.DoesNotExist:
                    pass
                else:
                    share['user_id'] = user.pk
        context['shares'] = shares
        return context


# retourne sauvegarde un facies de corrosion
# @ params stratigraphie au format urlencode
@csrf_exempt
def save(request):
    ms = MiCorrService()
    # transformation de urlencode en json
    data = json.loads(request.body)
    stratigraphy = data['stratigraphy']
    user_id = ms.getStratigraphyUser(stratigraphy)
    users_with_write_access = [user_id ] + [int(user['user_id']) for user in ms.get_all_shares(stratigraphy)]
    print(("CURRENT USER: %s" % request.user))
    if user_id:
        if request.user.id in users_with_write_access:
            response = ms.save(data)
        else:
            # Not allowed to save the stratigraphy!
            return HttpResponseForbidden()
    else:
        # This stratigraphy belongs to nobody, we try to add the current user_id
        # old stratigrapy with missing user_id property (creator_id there although)
        if request.user.is_authenticated:
            print(("setStratigraphyUser to USER ID: %s" % request.user))
            ms.setStratigraphyUser(stratigraphy, request.user.id)
        print("SAVING STRATIGRAPHY")
        response = ms.save(data)
    return HttpResponse(json.dumps(response), content_type='application/json')

# retourne les artefacts similaires
# @ params stratigraphie au format urlencode
@csrf_exempt
def match (request):
    ms = MiCorrService()
    data = json.loads(request.body)
    response = ms.match(data)
    return HttpResponse(json.dumps(response), content_type='application/json')

# supprime une stratigraphie
# @ params nom de la stratigraphie
def deleteStratigraphy(request, stratigraphy):
    ms = MiCorrService()

    response = ms.deleteStratigraphy(stratigraphy)

    return HttpResponse(json.dumps(response), content_type='application/json')

# Ajoute un artefact
# @ params nom de l'artefact
def addArtefact(request, artefact):
    ms = MiCorrService()

    response = ms.addArtefact(artefact)

    return HttpResponse(json.dumps(response), content_type='application/json')

# supprime un artefact
# @ params nom de l'artefact
def deleteArtefact(request, artefact):
    ms = MiCorrService()

    response = ms.delArtefact(artefact)
    return HttpResponse(json.dumps(response), content_type='application/json')

# Retourne toutes les caracteristiques d'une nature family
# @ params : stratigraphy uid de la nature family
def getnaturefamily(request, nature):
    ms = MiCorrService()
    return HttpResponse(json.dumps(ms.getnaturefamily(nature)), content_type='application/json')

@require_http_methods(["GET"])
def node_descriptions(request):
    return HttpResponse(json.dumps(dict(NodeDescription.objects.values_list('uid','text'))), content_type='application/json')
