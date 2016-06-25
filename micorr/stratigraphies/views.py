import simplejson as json
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from stratigraphies.service import micorrservice
from .forms import StratigraphyDescriptionUpdateForm


#retourne la page d'accueil
def home(request):
    return render(request, 'stratigraphies/index.html', locals())

@csrf_exempt
def test(request):
    if request.method == 'POST':
        print('Hello')

    ms = micorrservice.MiCorrService()
    ms.test()

    return render(request, 'stratigraphies/test.html', locals())

# Retourne tous les details d'une stratigraphie, characteristiques et interfaces
# @ params : stratigraphy nom de la stratigraphie
def getStratigraphyDetails(request, stratigraphy):
    ms = micorrservice.MiCorrService()
    return HttpResponse(json.dumps(ms.getStratigraphyDetails(stratigraphy)), content_type='application/json')

# retourne toutes les sous caracteristiques et sous caracteristiques
# @ params
def getallcharacteristic(request):
    ms = micorrservice.MiCorrService()
    return HttpResponse(json.dumps(ms.getAllCharacteristic()), content_type='application/json')

# retourne toutes les caracteristiques et sous caracteristiques
# @ params
def addStratigraphy(request, artefact, stratigraphy):
    ms = micorrservice.MiCorrService()
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
    ms = micorrservice.MiCorrService()
    exists = {"StratigraphyExists" : ms.stratigraphyExists(stratigraphy)}
    return HttpResponse(json.dumps(exists), content_type='application/json')

# retourne toutes les sous caracteristiques et sous caracteristiques
# @ params
def getStratigraphyByArtefact(request, artefact):
    ms = micorrservice.MiCorrService()
    strats = {'strats' : []}
    for strat in ms.getStratigraphyByArtefact(artefact):
        strats['strats'].append({'name' : strat.name, 'description' : strat.description})
    return HttpResponse(json.dumps(strats), content_type='application/json')

# retourne la liste de tous les artefacts
# @ params
def getallartefacts(request):
    ms = micorrservice.MiCorrService()
    artefacts = {'artefacts' : []}
    for artefact in ms.getAllArtefacts():
        artefacts['artefacts'].append({'name' : artefact.name})
    return HttpResponse(json.dumps(artefacts), content_type='application/json')


@csrf_exempt
def update_stratigraphy_description(request, stratigraphy):
    ms = micorrservice.MiCorrService()
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
    ms = micorrservice.MiCorrService()
    user_id = ms.getStratigraphyUser(stratigraphy)
    if user_id:
        if user_id == request.user.id:
            # We remove the property
            msg = ms.delStratigraphyUser(stratigraphy)
            messages.success(request, 'The stratigraphy was deleted!')
            return redirect('users:detail', request.user.username)
    messages.warning(request, 'Unable to delete the stratigraphy!')
    return redirect('users:detail', request.user.username)


# retourne sauvegarde un facies de corrosion
# @ params stratigraphie au format urlencode
@csrf_exempt
def save(request):
    ms = micorrservice.MiCorrService()
    # transformation de urlencode en json
    data = json.loads(request.body)
    stratigraphy = data['stratigraphy']
    user_id = ms.getStratigraphyUser(stratigraphy)
    print("CURRENT USER: %s" % request.user)
    if user_id:
        if user_id == request.user.id:
            response = ms.save(data)
        else:
            # Not allowed to save the stratigraphy!
            response = {'res': 0}
    else:
        # This stratigraphy belongs to nobody, we try to add the current user_id
        if request.user.is_authenticated():
            print("USER ID: %s" % request.user)
            ms.setStratigraphyUser(stratigraphy, request.user.id)
        print("SAVING STRATIGRAPHY")
        response = ms.save(data)
    return HttpResponse(json.dumps(response), content_type='application/json')

# retourne les artefacts similaires
# @ params stratigraphie au format urlencode
def match (request, data):
    ms = micorrservice.MiCorrService()
    #transformation de urlencode au format json
    data = json.loads(data)
    response = ms.match(data)
    return HttpResponse(json.dumps(response), content_type='application/json')

# supprime une stratigraphie
# @ params nom de la stratigraphie
def deleteStratigraphy(request, stratigraphy):
    ms = micorrservice.MiCorrService()

    response = ms.deleteStratigrapy(stratigraphy)

    return HttpResponse(json.dumps(response), content_type='application/json')

# Ajoute un artefact
# @ params nom de l'artefact
def addArtefact(request, artefact):
    ms = micorrservice.MiCorrService()

    response = ms.addArtefact(artefact)

    return HttpResponse(json.dumps(response), content_type='application/json')

# supprime un artefact
# @ params nom de l'artefact
def deleteArtefact(request, artefact):
    ms = micorrservice.MiCorrService()

    response = ms.delArtefact(artefact)
    return HttpResponse(json.dumps(response), content_type='application/json')

# Retourne toutes les caracteristiques d'une nature family
# @ params : stratigraphy uid de la nature family
def getnaturefamily(request, nature):
    ms = micorrservice.MiCorrService()
    return HttpResponse(json.dumps(ms.getnaturefamily(nature)), content_type='application/json')
