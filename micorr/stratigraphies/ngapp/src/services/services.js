/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les services nécessaires à l'application
 */
import {Stratigraphy} from "../business/stratigraphy";

// Contient toutes les requêtes vers le serveur
let MiCorrService = angular.module('micorrApp').factory('MiCorrService', function ($http, $q) {
    return{
        sayHello: function () {
            return 'Hello!';
        },

        isAuthenticated: function() {
            return $http.get('json/isauthenticated').then(null, function () {
                console.log('Problème de connexion avec le serveur');
                alert('Erreur de chargement');
            });
        },

        sendEmail: function(email_to, stratigraphy) {
            return $http.post('email' + '?email=' + email_to + '&stratigraphy=' + stratigraphy).then(null, function () {
                console.log('Problème de connexion avec le serveur');
                alert('Email non envoyé');
            });
        },

         getStratigraphySvg: function (name, width) {

         return $http.get('node/getStratigraphySvg' + '?name=' + name + '&width=' + width).then(null, function () {
            console.log('Problème de connexion avec le serveur pour récupérer le SVG');
         });
         },

         getStratigraphyImageUrl: function(name, width, format){
            return "micorr/node/exportStratigraphy?name="+name+"&width="+width+"&format="+format;
        },


        getAllArtefacts: function () {
            return $http.get('json/getallartefacts').then(null,function () {
                console.log('Problème de connexion avec le serveur pour récupérer les artefacts');
                alert('Erreur de chargement des artefacts');
            });
        },
        getStratigraphyByArtefact: function (artefact) {
            return $http.get('json/getstratsbyartefact/' + artefact).then(null,function () {
                console.log('Problème de connexion avec le serveur pour récupérer les stratigraphies');
                alert('Erreur de chargement des stratigraphies');
            });
        },
        getDetailedStratigraphy: function (stratigraphy,onSuccess) {
            return $http.get('json/getstratigraphydetails/' + stratigraphy).then(onSuccess, function () {
                console.log('Problème de connexion avec le serveur pour récupérer le détail des stratigraphies');
                alert('Erreur de chargement du détail des stratigraphies');
            });
        },
        stratigraphyExists: function (stratigraphy) {
            return $http.get('json/stratigraphyexists/' + stratigraphy).then(null,function () {
                console.log('Problème de connexion avec le serveur pour voir si la stratigraphie existe');
                alert('Erreur de dialogue avec le serveur');
            });
        },
        addStratigraphy: function (artefact, stratigraphy) {
            return $http.get('json/addstratigraphy/' + artefact + '/' + stratigraphy).then(null,function () {
                console.log('Problème de connexion avec le serveur pour ajouter une stratigraphie');
                alert('Erreur de dialogue avec le serveur');
            });
        },
        getAllCharacteristic: function () {
            return $http.get('json/getallcharacteristic').then(null,function () {
                console.log('Problème de connexion avec le serveur pour charger les caractéristiques');
                alert('Erreur de chargement des caractéristiques');
            });
        },
        getFamilyDescriptions: function () {
             return $http.get('node_descriptions').then(null,function ()
            {
                console.log('Error loading  glossary');
                alert('Error loading  glossary');
            })
        },
        saveStratigraphy: function (item) {
            $http.post('json/save', item, {headers: {'Content-Type': 'application/json'}}).then(function () {
                console.log('successfully saved');
            }, function (response) {
                console.log('Could not save stratigraphy: ' + response.status);
                window.alert('Error saving stratigraphy:' + response.status);
            });
        },

        matchStratigraphy: function (data) {
            return $http.post('json/match', data, {headers: {'Content-Type': 'application/json'} }).then(null,function () {
                console.log('Problème de connexion avec le serveur pour comparer la stratigraphie');
                alert('Erreur de lors du match avec la stratigraphie');
            });
        },
        deleteStratigraphy: function (data) {
            return $http.get('json/deleteStratigraphy/' + data).then(null,function () {
                console.log('Problème de connexion avec le serveur pour supprimer la stratigraphie');
                alert('Erreur de suppression de la stratigraphie');
            });
        },
        createArtefact: function (data) {
            return $http.get('json/addartefact/' + data).then(null,function () {
                console.log('Problème de connexion avec le serveur pour créer un artefact');
                alert('Erreur de création de artefact');
            });
        },
        deleteArtefact: function (data) {
            return $http.get('json/deleteartefact/' + data).then(null,function () {
                console.log('Problème de connexion avec le serveur pour supprimer un artefact');
                alert('Erreur de suppression de artefact');
            });
        }
    }
}).name;

// Contient les données sur les strates qui seront échangées entre les différents contrôlleurs
let StratigraphyData =  angular.module('micorrApp').factory('StratigraphyData', function StratigraphyDataFactory() {
    var getStratigraphyData = function () {

        var stratig = null;

        return {

            getStrataNature: function (strataData) {
                let c = strataData.characteristics.find(e => e.family == "natureFamily");
                return c ? c.real_name : undefined;
            },

            getStratigraphy: function (colourFamily='colourFamily') {
                if (stratig == null) {
                    stratig = new Stratigraphy(colourFamily);
                }
                return stratig;
            },
            swapTwoStrata: function (index1, index2) {
                stratig.swapTwoStrata(index1, index2);
            },

            delStratum: function (index) {
                stratig.delStratum(index);
            },

            pushOneStrata: function (strata) {
                stratig.addStratum(strata);
            },

            fill: function (characteristics, descriptions) {
                this.rawCharacteristics = characteristics; //todo remove rawCharacteristics ?
                this.descriptions = descriptions;
                // hard coded client side dependency between CS colour families and observation instrument selected for stratygraphy
                // todo includes in graph model when saved as "stratigraphy characteristic"
                const OBSERVATION_INSTRUMENT_FAMILIES = {
                    morphologyColourWithOpticalMicroscopeBrightFieldCSFamily: 'morphologyObservationInstrumentOpticalMicroscopeBrightFieldCSCharacteristic',
                    morphologyColourWithOpticalMicroscopeDarkFieldCSFamily: 'morphologyObservationInstrumentOpticalMicroscopeDarkFieldCSCharacteristic',
                    morphologyColourWithScanningElectronMicroscopeSecondaryElectronsCSFamily: 'morphologyObservationInstrumentScanningElectronMicroscopeSecondaryElectronsCSCharacteristic',
                    morphologyColourWithScanningElectronMicroscopeBackscatteredElectronsCSFamily: 'morphologyObservationInstrumentScanningElectronMicroscopeBackscatteredElectronsCSCharacteristic'
                };
                // single loop characteristic retrieval to replace parseCharacteristic
                // to be replaced by direct object assignment
                for (let familyCharacteristics of characteristics) {
                    this[familyCharacteristics.family] = familyCharacteristics;
                    if (familyCharacteristics.family in OBSERVATION_INSTRUMENT_FAMILIES) {
                        // if the family depends on given observation instrument mark it
                        familyCharacteristics.ifObservationInstrument=OBSERVATION_INSTRUMENT_FAMILIES[familyCharacteristics.family];
                    }
                    if (this.descriptions[familyCharacteristics.family]) { //overwrite node's description with wagtail snipet version if any
                        familyCharacteristics.description = this.descriptions[familyCharacteristics.family];
                    }
                }
            },
            getSelectedStrata: function () {
                return this.selectedStrata===undefined ? 0 :this.selectedStrata;
            },
            setSelectedStrata: function (index) {
                this.selectedStrata = index;
            }
        }
    };
    return getStratigraphyData();
}).name;



let httpRequestTracker = angular.module('micorrApp').factory('httpRequestTracker', function httpRequestTrackerFactory($http) {
    var httpRequestTracker = {};
    httpRequestTracker.hasPendingRequests = function () {
        return $http.pendingRequests.length > 0;
    };
    return httpRequestTracker;
}).name;

export {MiCorrService, StratigraphyData, httpRequestTracker};



