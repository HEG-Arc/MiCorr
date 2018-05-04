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

         return $http.post('node/getStratigraphySvg' + '?name=' + name + '&width=' + width).then(null, function () {
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
        getDetailedStratigraphy: function (stratigraphy) {
            return $http.get('json/getstratigraphydetails/' + stratigraphy).then(null,function () {
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
            $http.post('json/save', item, {headers: {'Content-Type': 'application/json'} }).then(null,function (data, status, headers, config) {
                console.log('Could not save stratigraphy: ' +status);
                window.alert('Error saving stratigraphy:'+ status);
            }).then(function () {
                console.log('Saved');
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
                var nature;
                var found = false;
                var i = 0;
                while (!found && i < strataData.characteristics.length) {
                    var currentCharacteristic = strataData.characteristics[i];
                    if (currentCharacteristic.family == "natureFamily") {
                        nature = currentCharacteristic.real_name;
                        found = true;
                    }
                    i++;
                }
                return nature;
            },

            getStratigraphy: function () {
                if (stratig == null) {
                    stratig = new Stratigraphy;
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
            stratigraphyToJson: function () {

            },

            Fill: function (characteristics,descriptions) {

                /*
                 * parcours les caractéristiques et retourne les caractéristiques de la famille voulue
                 * @params name : nom de la famille
                 * @returns liste des caractéristiques d'une famille au format json
                 */
                var parseCharasteristic = function (name) {
                    for (var i = 0; i < characteristics.length; i++) {
                        if (characteristics[i].family == name)
                            return characteristics[i];
                    }
                };

                /* parcours les sous-caractéristiques de data et retourne les sous caractéristique pour une famille
                 * comme une sous caractéristique n'est pas liée à une famille on doit pour une famille parcourir toutes les sous-caractéristique de chaque caractéristique
                 * et retourner ces sous caractéristiques dans une liste
                 * @params family : nom de la famille
                 *         level('sub') : on cherche les sous-caractéristiques
                 *         level('subsub') : on cherche les sous-sous caractéristiques
                 * @returns liste des caractéristiques d'une famille au format Array
                 */
                var getSubCharacteristicsFromFamily = function (family, level) {
                    var subList = [];
                    var subsubList = [];
                    var list = parseCharasteristic(family);
                    list = list['characteristics'];
                    // on parcourt les caractéristiques et sous-caractéristiques pour la famille demandée
                    // on alimente ûn tableau pour les sub et subsub
                    for (var i = 0; i < list.length; i++) {
                        var sub = list[i]['subcharacteristics'];
                        for (var j = 0; j < sub.length; j++) {
                            subList.push({'name': sub[j].sub_real_name, 'uid': sub[j].name});
                            var subsub = sub[j]['subcharacteristics'];
                            for (var k = 0; k < subsub.length; k++) {
                                //console.log(subsub);
                                subsubList.push({'name': subsub[k].name});
                            }
                        }

                    }

                    // selon ce qu'on demande on retourne l'un ou l'autre
                    if (level == "sub")
                        return subList;
                    else if (level == "subsub")
                        return subsubList;

                };

                this.setRawCharacteristics(characteristics);
                this.descriptions = descriptions;

                // single loop characteristic retrieval to replace parseCharacteristic
                // (works only when characteristic and property names are the same :(
                for (var i = 0; i < characteristics.length; i++) {
                        this[characteristics[i].family] = characteristics[i];
                    }
/*
                // following characteristics have been retrieved correctly by loop above
                this.shapeFamily = parseCharasteristic('shapeFamily');
                this.widthFamily = parseCharasteristic('widthFamily');
                this.thicknessFamily = parseCharasteristic('thicknessFamily');
                this.continuityFamily = parseCharasteristic('continuityFamily');
                this.directionFamily = parseCharasteristic('directionFamily');
                this.colourFamily = parseCharasteristic('colourFamily');
                this.brightnessFamily = parseCharasteristic('brightnessFamily');
                this.opacityFamily = parseCharasteristic('opacityFamily');
                this.magnetismFamily = parseCharasteristic('magnetismFamily');
                this.porosityFamily = parseCharasteristic('porosityFamily');
                this.cohesionFamily = parseCharasteristic('cohesionFamily');
                this.hardnessFamily = parseCharasteristic('hardnessFamily');
                this.crackingFamily = parseCharasteristic('crackingFamily');
                this.elementFamily = parseCharasteristic('elementFamily');
                this.compoundFamily = parseCharasteristic('compoundFamily');
*/
                this.scompositionFamily = parseCharasteristic('sCompositionFamily');
                this.nmmCompositionFamily = parseCharasteristic('nmmCompositionFamily');
                this.dcompositionFamily = parseCharasteristic('dCompositionFamily');
                this.pomcompositionFamily = parseCharasteristic('pomCompositionFamily');


                this.cmlevelofcorrosionFamily = parseCharasteristic('cmLevelOfCorrosionFamily');
                this.cprimicrostructureFamily = parseCharasteristic('cpriMicrostructureFamily');
                this.cmcpmicrostructureFamily = parseCharasteristic('cmCpMicrostructureFamily');
                this.mmicrostructureFamily = parseCharasteristic('mMicrostructureFamily');
                this.interfaceprofileFamily = parseCharasteristic('interfaceProfileFamily');
                this.interfacetransitionFamily = parseCharasteristic('interfaceTransitionFamily');
                this.interfaceroughnessFamily = parseCharasteristic('interfaceRoughnessFamily');
                this.interfaceadherenceFamily = parseCharasteristic('interfaceAdherenceFamily');
                this.submmicrostructureFamily = getSubCharacteristicsFromFamily('mMicrostructureFamily', 'sub');
                this.subcprimicrostructureFamily = getSubCharacteristicsFromFamily('cpriMicrostructureFamily', 'sub');

                this.subcmLevelOfCorrosionFamily = getSubCharacteristicsFromFamily('cmLevelOfCorrosionFamily', 'sub');
            },
            getRawCharacteristics: function () {
                return this.rawCharacteristics;
            },
            setRawCharacteristics: function (data) {
                this.rawCharacteristics = data;
            },
            getSelectedStrata: function () {
                return this.selectedStrata;
            },
            setSelectedStrata: function (index) {
                this.selectedStrata = index;
            },
            setSubmmicrostructureFamily: function (submmicrostructureFamily) {
                this.submmicrostructureFamily = submmicrostructureFamily;
            },
            getSubmmicrostructureFamily: function () {
                return this.submmicrostructureFamily;
            },
            setSubcmLevelOfCorrosionFamily: function (subcmLevelOfCorrosionFamily) {
                this.subcmLevelOfCorrosionFamily = subcmLevelOfCorrosionFamily;
            },
            getSubcmLevelOfCorrosionFamily: function () {
                return this.subcmLevelOfCorrosionFamily;
            },
            setSubcprimicrostructureFamily: function (subcprimicrostructureFamily) {
                this.subcprimicrostructureFamily = subcprimicrostructureFamily;
            },
            getSubcprimicrostructureFamily: function () {
                return this.subcprimicrostructureFamily;
            },

            setCmlevelofcorrosionFamily: function (cmlevelofcorrosionFamily) {
                this.cmlevelofcorrosionFamily = cmlevelofcorrosionFamily;
            },
            getCmlevelofcorrosionFamily: function () {
                return this.cmlevelofcorrosionFamily;
            },
            setCprimicrostructureFamily: function (cprimicrostructureFamily) {
                this.cprimicrostructureFamily = cprimicrostructureFamily;
            },
            getCprimicrostructureFamily: function () {
                return this.cprimicrostructureFamily;
            },
            setSubmmicrostructureFamily: function (submmicrostructureFamily) {
                this.submmicrostructureFamily = submmicrostructureFamily;
            },
            getSubmmicrostructureFamily: function () {
                return this.submmicrostructureFamily;
            },
            setInterfaceadherenceFamily: function (interfaceadherenceFamily) {
                this.interfaceadherenceFamily = interfaceadherenceFamily;
            },
            getInterfaceadherenceFamily: function () {
                return this.interfaceadherenceFamily;
            },
            setInterfaceroughnessFamily: function (interfaceroughnessFamily) {
                this.interfaceroughnessFamily = interfaceroughnessFamily;
            },
            getInterfaceroughnessFamily: function () {
                return this.interfaceroughnessFamily;
            },
            setInterfacetransitionFamily: function (interfacetransitionFamily) {
                this.interfacetransitionFamily = interfacetransitionFamily;
            },
            getInterfacetransitionFamily: function () {
                return this.interfacetransitionFamily;
            },
            setInterfaceprofileFamily: function (interfaceprofileFamily) {
                this.interfaceprofileFamily = interfaceprofileFamily;
            },
            getInterfaceprofileFamily: function () {
                return this.interfaceprofileFamily;
            },
            setPomcompositionFamily: function (pomcompositionFamily) {
                this.pomcompositionFamily = pomcompositionFamily;
            },
            getPomcompositionFamily: function () {
                return this.pomcompositionFamily;
            },
            setDcompositionFamily: function (dcompositionFamily) {
                this.dcompositionFamily = dcompositionFamily;
            },
            getDcompositionFamily: function () {
                return this.dcompositionFamily;
            },
            setNmmCompositionFamily: function (nmmCompositionFamily) {
                this.nmmCompositionFamily = nmmCompositionFamily;
            },
            getNmmcompositionFamily: function () {
                return this.nmmCompositionFamily;
            },
            setScompositionFamily: function (scompositionFamily) {
                this.scompositionFamily = scompositionFamily;
            },
            getScompositionFamily: function () {
                return this.scompositionFamily;
            },
            getCrackingFamily: function () {
                return this.crackingFamily;
            },
            setCrackingFamily: function (crackingFamily) {
                this.crackingFamily = crackingFamily;
            },
            getHardnessFamily: function () {
                return this.hardnessFamily;
            },
            setHardnessFamily: function (hardnessFamily) {
                this.hardnessFamily = hardnessFamily;
            },
            setCohesionFamily: function (cohesionFamily) {
                this.cohesionFamily = cohesionFamily;
            },
            getCohesionFamily: function () {
                return this.cohesionFamily;
            },
            setMmicrostructureFamily: function (mmicrostructureFamily) {
                this.mmicrostructureFamily = mmicrostructureFamily;
            },
            getMmicrostructureFamily: function () {
                return this.mmicrostructureFamily;
            },
            setCprimicrostructureFamily: function (cprimicrostructureFamily) {
                this.cprimicrostructureFamily = cprimicrostructureFamily;
            },
            getCprimicrostructureFamily: function () {
                return this.cprimicrostructureFamily;
            },
            getPorosityFamily: function () {
                return this.porosityFamily;
            },
            setPorosityFamily: function (porosityFamily) {
                this.porosityFamily = porosityFamily;
            },
            getMagnetismFamily: function () {
                return this.magnetismFamily;
            },
            setMagnetismFamily: function (magnetismFamily) {
                this.magnetismFamily = magnetismFamily;
            },
            getOpacityFamily: function () {
                return this.opacityFamily;
            },
            setOpacityFamily: function (opacityFamily) {
                this.opacityFamily = opacityFamily;
            },
            setBrightnessFamily: function (brightnessFamily) {
                this.brightnessFamily = brightnessFamily;
            },
            getBrightnessFamily: function () {
                return this.brightnessFamily;
            },
            getColourFamily: function () {
                return this.colourFamily;
            },
            setColourFamily: function (colourFamily) {
                this.colourFamily = colourFamily;
            },
            setShapeFamily: function (shapeFamily) {
                this.shapeFamily = shapeFamily;
            },
            getShapeFamily: function () {
                return this.shapeFamily;
            },
            setWidthFamily: function (widthFamily) {
                this.widthFamily = widthFamily;
            },
            getWidthFamily: function () {
                return this.widthFamily;
            },
            setThicknessFamily: function (thicknessFamily) {
                this.thicknessFamily = thicknessFamily;
            },
            getThicknessFamily: function () {
                return this.thicknessFamily;
            },
            setContinuityFamily: function (continuityFamily) {
                this.continuityFamily = continuityFamily;
            },
            getContinuityFamily: function () {
                return this.continuityFamily;
            },
            setDirectionFamily: function (directionFamily) {
                this.directionFamily = directionFamily;
            },
            getDirectionFamily: function () {
                return this.directionFamily;
            },
            getCmcpmicrostructureFamily: function () {
                return this.cmcpmicrostructureFamily;
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



