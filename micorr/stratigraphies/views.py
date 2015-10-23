from django.shortcuts import render
from django.http import HttpResponse
import simplejson as json
from .ch.hearc.ig.micorr.service.MiCorrService import MiCorrService


#retourne la page d'accueil
def home(request):
    return render(request, 'stratigraphies/index.html', locals())

def test(request):
    print ("HELLO")

    ms = MiCorrService()
    ms.test()

    return render(request, 'stratigraphies/test.html', locals())

# Retourne tous les details d'une stratigraphie, characteristiques et interfaces
# @ params : stratigraphy nom de la stratigraphie
def getStratigraphyDetails(request, stratigraphy):
    ms = MiCorrService()
    return HttpResponse(json.dumps(ms.getStratigraphyDetails(stratigraphy)), content_type='application/json')

# retourne toutes les sous caracteristiques et sous caracteristiques
# @ params
def getallcharacteristic(request):
    ms = MiCorrService()
    return HttpResponse(json.dumps(ms.getAllCharacteristic()), content_type='application/json')

# retourne toutes les caracteristiques et sous caracteristiques
# @ params
def addStratigraphy(request, artefact, stratigraphy):
    ms = MiCorrService()
    response = {"insertStatus" : ms.addStratigraphy(artefact, stratigraphy)}
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
    strats = {'strats' : []}
    for strat in ms.getStratigraphyByArtefact(artefact):
        strats['strats'].append({'name' : strat.name, 'description' : strat.description})
    return HttpResponse(json.dumps(strats), content_type='application/json')

# retourne la liste de tous les artefacts
# @ params
def getallartefacts(request):
    ms = MiCorrService()
    artefacts = {'artefacts' : []}
    for artefact in ms.getAllArtefacts():
        artefacts['artefacts'].append({'name' : artefact.name})
    return HttpResponse(json.dumps(artefacts), content_type='application/json')

# retourne sauvegarde un facies de corrosion
# @ params stratigraphie au format urlencode
def save(request, data):
    ms = MiCorrService()

    # transformation de urlencode en json
    data = json.loads(data)

    response = ms.save(data)

    return HttpResponse(json.dumps(response), content_type='application/json')

# retourne les artefacts similaires
# @ params stratigraphie au format urlencode
def match (request, data):
    ms = MiCorrService()
    #transformation de urlencode au format json
    data = json.loads(data)
    response = ms.match(data)
    return HttpResponse(json.dumps(response), content_type='application/json')

# supprime une stratigraphie
# @ params nom de la stratigraphie
def deleteStratigraphy(request, stratigraphy):
    ms = MiCorrService()

    response = ms.deleteStratigrapy(stratigraphy)

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