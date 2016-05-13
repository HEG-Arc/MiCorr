/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les services nécessaires à l'application
 */

// Contient toutes les requêtes vers le serveur
angular.module('micorrApp').factory('MiCorrService', function ($http, $q) {
    return{
        sayHello: function(){
            return 'Hello!';
        },
        getAllArtefacts : function(){
            return $http.get('json/getallartefacts').error(function(){
                console.log('Problème de connexion avec le serveur pour récupérer les artefacts');
                alert('Erreur de chargement des artefacts');
            });
        },
        getStratigraphyByArtefact : function(artefact){
            return $http.get('json/getstratsbyartefact/' + artefact).error(function(){
                console.log('Problème de connexion avec le serveur pour récupérer les stratigraphies');
                alert('Erreur de chargement des stratigraphies');
            });
        },
        getDetailedStratigraphy : function(stratigraphy) {
            return $http.get('json/getstratigraphydetails/' + stratigraphy).error(function(){
                console.log('Problème de connexion avec le serveur pour récupérer le détail des stratigraphies');
                alert('Erreur de chargement du détail des stratigraphies');
            });
        },
        stratigraphyExists : function(stratigraphy){
            return $http.get('json/stratigraphyexists/' + stratigraphy).error(function(){
                console.log('Problème de connexion avec le serveur pour voir si la stratigraphie existe');
                alert('Erreur de dialogue avec le serveur');
            });
        },
        addStratigraphy : function(artefact, stratigraphy){
            return $http.get('json/addstratigraphy/' + artefact + '/' + stratigraphy).error(function(){
                console.log('Problème de connexion avec le serveur pour ajouter une stratigraphie');
                alert('Erreur de dialogue avec le serveur');
            });
        },
        getAllCharacteristic : function() {
            return $http.get('json/getallcharacteristic').error(function(){
                console.log('Problème de connexion avec le serveur pour charger les caractéristiques');
                alert('Erreur de chargement des caractéristiques');
            });
        },
        saveStratigraphy : function(data) {
            return $http.get('json/save/' + data).error(function(){
                console.log('Problème de connexion avec le serveur pour sauver la stratigraphie');
                alert('Erreur de sauvegarde de la stratigraphie');
            });
        },
        matchStratigraphy : function(data) {
            return $http.get('json/match/' + data).error(function(){
                console.log('Problème de connexion avec le serveur pour comparer la stratigraphie');
                alert('Erreur de lors du match avec la stratigraphie');
            });
        },
        deleteStratigraphy : function(data) {
            return $http.get('json/deleteStratigraphy/' + data).error(function(){
                console.log('Problème de connexion avec le serveur pour supprimer la stratigraphie');
                alert('Erreur de suppression de la stratigraphie');
            });
        },
        createArtefact : function(data) {
            return $http.get('json/addartefact/' + data).error(function(){
                console.log('Problème de connexion avec le serveur pour créer un artefact');
                alert('Erreur de création de artefact');
            });
        },
        deleteArtefact : function(data) {
            return $http.get('json/deleteartefact/' + data).error(function(){
                console.log('Problème de connexion avec le serveur pour supprimer un artefact');
                alert('Erreur de suppression de artefact');
            });
        }
    }
});

// Contient les données sur les strates qui seront échangées entre les différents contrôlleurs
angular.module('micorrApp').factory('StratigraphyData', function StratigraphyDataFactory() {
    var getStratigraphyData = function() {

        var stratig = null;
        var selectedStrata = 0;


        return {
            getStratigraphy: function(){
                if (stratig == null){
                    stratig = new stratigraphy.Stratigraphy;
                }
                return stratig;
            },
            getSelectedStrata: function(){
                return this.selectedStrata();
            },
            setSelectedStrata: function(index){
                this.selectedStrata = index;
            }
        }
    };
    return getStratigraphyData();
});


// Contient les données sur les strates qui seront échangées entre les différents contrôlleurs
angular.module('micorrApp').factory('StrataData', function StrataDataFactory() {
    var getStrataData = function() {

        var rawCharacteristics = "";    // Caractéristiques retournées par le serveur au format json et non modifié
        var selectedStrata = 0;         // index de la strate sélectionnée par l'utilisateur
        var rstratas = [];              // Liste de toutes les strates pour la stratigraphie en cours
        var listImages = [];            // Liste de toutes les images raphaeljs pour la stratigraphie en cours
        var shapeFamily = [];
        var widthFamily = [];
        var thicknessFamily = [];
        var continuityFamily = [];
        var directionFamily = [];
        var colourFamily = [];
        var brightnessFamily = [];
        var opacityFamily = [];
        var magnetismFamily = [];
        var porosityFamily = [];
        var cohesionFamily = [];
        var hardnessFamily = [];
        var crackingFamily = [];
        var scompositionFamily = [];
        var nmmcompositionFamily = [];
        var dcompositionFamily = [];
        var pomcompositionFamily = [];
        var cpcompositionFamily = [];
        var cmcompositionFamily = [];
        var mcompositionFamily = [];
        var cmlevelofcorrosionFamily = [];
        var cprimicrostructureFamily = [];
        var mmicrostructureFamily = [];
        var interfaceprofileFamily = [];
        var interfacetransitionFamily = [];
        var interfaceroughnessFamily = [];
        var interfaceadherenceFamily = [];
        var subcpcompositionFamily = [];
        var subsubcpcompositionFamily = [];
        var cpcompositionextensionFamily = [];
        var cprimicrostructureaggregatecompositionFamily = [];
        var cprimicrostructureaggregatecompositionextensionFamily = [];
        var submmicrostructureFamily = [];
        var subcprimicrostructureFamily = [];
        var subcprimicrostructureaggregatecompositionFamily = [];
        var subsubcprimicrostructureaggregatecompositionFamily = [];
        var subcmcompositionFamily = [];
        var subcmLevelOfCorrosionFamily = [];
        var submmicrostructureFamily = [];
        var submcompositionFamily = [];

        return {
            clear: function () {
                selectedStrata = 0;
                rstratas = new Array();
                namesStratas = new Array();
                listImages = new Array();
            },
            clearImages: function () {
                listImages = new Array();
            },
            getCurrentStrata: function () {
                if (rstratas.length == 0)
                    return new Strata();
                return rstratas[selectedStrata];
            },
            setSelectedStrata: function (i) {
                this.selectedStrata = i;
            },
            getCurrentSelectedStrata: function () {
                return this.selectedStrata;
            },
            getStratas: function () {
                return rstratas;
            },
            pushOneStrata: function (strata) {
                rstratas.push(strata);
            },
            pushOneImage: function (image) {
                listImages.push(image);
            },
            getImages: function () {
                return listImages;
            },
            swapTwoStratas: function (index1, index2) {
                var temp;
                temp = rstratas[index1];
                rstratas[index1] = rstratas[index2];
                rstratas[index2] = temp;
            },
            delStrata: function () {
                var idel = parseInt(this.selectedStrata);
                rstratas.splice(idel, 1);
                // SI on a plus de strate alors on en rajoute une nouvelle pour éviter les erreurs
                if (rstratas.length == 0)
                    rstratas.push(natureFactory("M"));
            },
            delStrata: function (index) {
                var idel = parseInt(index);
                rstratas.splice(idel, 1);
                // SI on a plus de strate alors on en rajoute une nouvelle pour éviter les erreurs
                if (rstratas.length == 0)
                    rstratas.push(natureFactory("M"));
            },
            // création d'un json contenant toute la stratigraphie au format JSON
            StratasToJson: function (artefactName, stratigraphyName) {
                var st = rstratas;
                var temp = {'artefact': artefactName, 'stratigraphy': stratigraphyName, 'stratas': []};
                for (var i = 0; i < st.length; i++) {
                    var s = st[i];
                    var strat = {'name': s.getName(), 'characteristics': '', 'interfaces': ''};
                    strat['characteristics'] = s.getJsonCharacteristics();
                    strat['interfaces'] = s.getJsonInterface();
                    temp['stratas'].push(strat);
                }
                console.log(temp);
                return temp;
            },
            Fill: function (data) {
                var characteristics = data;

                /*
                 * parcours les caractéristiques de data et retourne les caractéristiques de la famille voulue
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
                            subList.push({'name': sub[j].name});
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
                this.scompositionFamily = parseCharasteristic('sCompositionFamily');
                this.nmmcompositionFamily = parseCharasteristic('nmmCompositionFamily');
                this.dcompositionFamily = parseCharasteristic('dCompositionFamily');
                this.pomcompositionFamily = parseCharasteristic('pomCompositionFamily');
                this.cpcompositionFamily = parseCharasteristic('cpCompositionFamily');
                this.cmcompositionFamily = parseCharasteristic('cmCompositionFamily');
                this.mcompositionFamily = parseCharasteristic('mCompositionFamily');
                this.cmlevelofcorrosionFamily = parseCharasteristic('cmLevelOfCorrosionFamily');
                this.cprimicrostructureFamily = parseCharasteristic('cpriMicrostructureFamily');
                this.mmicrostructureFamily = parseCharasteristic('mMicrostructureFamily');
                this.interfaceprofileFamily = parseCharasteristic('interfaceProfileFamily');
                this.interfacetransitionFamily = parseCharasteristic('interfaceTransitionFamily');
                this.interfaceroughnessFamily = parseCharasteristic('interfaceRoughnessFamily');
                this.interfaceadherenceFamily = parseCharasteristic('interfaceAdherenceFamily');
                this.subcpcompositionFamily = getSubCharacteristicsFromFamily('cpCompositionFamily', 'sub')
                this.subsubcpcompositionFamily = getSubCharacteristicsFromFamily('cpCompositionFamily', 'subsub')
                this.cpcompositionextensionFamily = parseCharasteristic('cpCompositionExtensionFamily', 'sub');
                this.cprimicrostructureaggregatecompositionFamily = parseCharasteristic('cpriMicrostructureAggregateCompositionFamily');
                this.cprimicrostructureaggregatecompositionextensionFamily = parseCharasteristic('cpriMicrostructureAggregateCompositionExtensionFamily');
                this.submmicrostructureFamily = getSubCharacteristicsFromFamily('mMicrostructureFamily', 'sub');
                this.subcprimicrostructureFamily = getSubCharacteristicsFromFamily('cpriMicrostructureFamily', 'sub');
                this.subcprimicrostructureaggregatecompositionFamily = getSubCharacteristicsFromFamily('cpriMicrostructureAggregateCompositionFamily', 'sub');
                this.subsubcprimicrostructureaggregatecompositionFamily = getSubCharacteristicsFromFamily('cpriMicrostructureAggregateCompositionFamily', 'subsub');
                this.subcmcompositionFamily = getSubCharacteristicsFromFamily('cmCompositionFamily', 'sub');
                this.subcmLevelOfCorrosionFamily = getSubCharacteristicsFromFamily('cmLevelOfCorrosionFamily', 'sub');
                this.submmicrostructureFamily = getSubCharacteristicsFromFamily('mMicrostructureFamily', 'sub');
                this.submcompositionFamily = getSubCharacteristicsFromFamily('mCompositionFamily', 'sub');
            },
            getRawCharacteristics: function () {
                return this.rawCharacteristics;
            },
            setRawCharacteristics: function (data) {
                this.rawCharacteristics = data;
            },
            getSubmcompositionFamily: function () {
                return this.submcompositionFamily;
            },
            setSubmcompositionFamily: function (submcompositionFamily) {
                this.submcompositionFamily = submcompositionFamily;
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
            setSubcmcompositionFamily: function (subcmcompositionFamily) {
                this.subcmcompositionFamily = subcmcompositionFamily;
            },
            getSubcmcompositionFamily: function () {
                return this.subcmcompositionFamily;
            },
            setSubsubcprimicrostructureaggregatecompositionFamily: function (subsubcprimicrostructureaggregatecompositionFamily) {
                this.subsubcprimicrostructureaggregatecompositionFamily = subsubcprimicrostructureaggregatecompositionFamily;
            },
            getSubsubcprimicrostructureaggregatecompositionFamily: function () {
                return this.subsubcprimicrostructureaggregatecompositionFamily;
            },
            setSubcprimicrostructureaggregatecompositionFamily: function (subcprimicrostructureaggregatecompositionFamily) {
                this.subcprimicrostructureaggregatecompositionFamily = subcprimicrostructureaggregatecompositionFamily;
            },
            getSubcprimicrostructureaggregatecompositionFamily: function () {
                return this.subcprimicrostructureaggregatecompositionFamily;
            },
            setSubcprimicrostructureFamily: function (subcprimicrostructureFamily) {
                this.subcprimicrostructureFamily = subcprimicrostructureFamily;
            },
            getSubcprimicrostructureFamily: function () {
                return this.subcprimicrostructureFamily;
            },
            setSubsubcpcompositionFamily: function (subsubcpcompositionFamily) {
                this.subsubcpcompositionFamily = subsubcpcompositionFamily;
            },
            getSubsubcpcompositionFamily: function () {
                return this.subsubcpcompositionFamily;
            },
            getSubcpcompositionFamily: function () {
                return this.subcpcompositionFamily;
            },
            setSubcpcompositionFamily: function (subcpcompositionFamily) {
                this.subcpcompositionFamily = subcpcompositionFamily;
            },
            setCprimicrostructureaggregatecompositionextensionFamily: function (cprimicrostructureaggregatecompositionextensionFamily) {
                this.cprimicrostructureaggregatecompositionextensionFamily = cprimicrostructureaggregatecompositionextensionFamily;
            },
            getCprimicrostructureaggregatecompositionextensionFamily: function () {
                return this.cprimicrostructureaggregatecompositionextensionFamily;
            },
            getCprimicrostructureaggregatecompositionFamily: function () {
                return this.cprimicrostructureaggregatecompositionFamily;
            },
            setCprimicrostructureaggregatecompositionFamily: function (cprimicrostructureaggregatecompositionFamily) {
                this.cprimicrostructureaggregatecompositionFamily = cprimicrostructureaggregatecompositionFamily;
            },
            setCpcompositionextensionFamily: function (cpcompositionextensionFamily) {
                this.cpcompositionextensionFamily = cpcompositionextensionFamily;
            },
            getCpcompositionextensionFamily: function () {
                return this.cpcompositionextensionFamily;
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
            setMcompositionFamily: function (mcompositionFamily) {
                this.mcompositionFamily = mcompositionFamily;
            },
            getMcompositionFamily: function () {
                return this.mcompositionFamily;
            },
            setCmcompositionFamily: function (cmcompositionFamily) {
                this.cmcompositionFamily = cmcompositionFamily;
            },
            getCmcompositionFamily: function () {
                return this.cmcompositionFamily;
            },
            getCpcompositionFamily: function () {
                return this.cpcompositionFamily;
            },
            setCpcompositionFamily: function (cpcompositionFamily) {
                this.cpcompositionFamily = cpcompositionFamily;
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
            setNmmCompositionFamily: function (nmmcompositionFamily) {
                this.nmmcompositionFamily = nmmcompositionFamily;
            },
            getNmmcompositionFamily: function () {
                return this.nmmcompositionFamily;
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
            }
        }
    };
    return getStrataData();
});

angular.module('micorrApp').factory('httpRequestTracker', function httpRequestTrackerFactory($http) {
        var httpRequestTracker = {};
        httpRequestTracker.hasPendingRequests = function () {
            return $http.pendingRequests.length > 0;
        };
        return httpRequestTracker;
});




