'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ShowStratCtrl
 * @description
 * # ShowStratCtrl
 * Controlleur qui est appelé lors de l'affichage d'une stratographie
 */
angular.module('micorrApp')
    .controller('ShowStratCtrl', function ($scope, $routeParams, $timeout, MiCorrService, StrataData, ngProgress) {

        // Variable mise a false à chaque fois qu'n ouvre une stratigraphie
        $scope.askLeave = false;
        // Quand l'url change on appelle cette méthode
        $scope.$on('$locationChangeStart', function( event ) {
            // Si on a modifié quelque chose alors on demande si on veut quitter la page sans sauver
            if ($scope.askLeave == true){
                var answer = confirm("Are you sure you want to leave this page ?")
                if (!answer) {
                    event.preventDefault();
                }
            }
        });

        /*
        * Déplace une strate vers le haut et met à jour l'interface
        * @params i strate actuelle qui va se faire déplacer
        */
        $scope.movestrataup = function(i) {
                var current = parseInt(i);
                if (current > 0) {
                    StrataData.swapTwoStratas(current, current - 1);
                    $scope.$broadcast('doUpdate', current - 1);
                    $scope.$broadcast('updateDraw');
                }
        };

         /*
         * Déplace une strate vers le bas et met à jour l'interface
         * @params i strate actuelle qui va se faire déplacer
         */
        $scope.movestratadown = function(i) {
            var current = parseInt(i);
            if (parseInt(StrataData.getCurrentSelectedStrata()) + 1 < StrataData.getStratas().length){
                StrataData.swapTwoStratas(current, current + 1);
                $scope.$broadcast('doUpdate', current + 1);
                $scope.$broadcast('updateDraw', current + 1);
            }
        };

        var initShowStrata = function(){
            // variable qui permettent d'afficher les interfaces ou morphologies
            // par défaut quand on arrive sur l'application, on aterrit sur l'onglet de morphologie
            $scope.activeTabInterface = false;
            $scope.activeMorphologyTab = true;

            /*
             * Affiche l'onglet des interface quand l'utilisateur clique sur l'interface générée
             */
            $scope.setInterfaceTab = function (val) {
                $scope.activeTabInterface = val;
                $scope.activeMorphologyTab = !val;
                $scope.$apply();
            }


            $scope.artefactName = $routeParams.artefact;        // nom de l'artefact
            $scope.stratigraphyName = $routeParams.strat;           // nom de la stratigraphie
            $scope.stratigrapgydescription = $routeParams.stratigrapgydescription; // description de la stratigraphie
            $scope.rstratas = StrataData.getStratas();      // liste des strates de la stratigraphie se trouvant dans le service
            $scope.natures = natures;                      // liste des natures de matériau dans le fichier init.js
            $scope.strataName = "No strata selected";         // par défaut aucune strata n'est choisie
            $scope.natureFamilyname = "";                           // par défaut aucune nature n'est choisie

            //ces variables servent à afficher/masquer dans le formulaire les champs appartenants à une nature de matériau
            // par exemple SI on prend D, le champ colourFamily s'affiche alors qu'il va se masquer dès qu'on va sélectionner un SV
            $scope.showTabForms = false;        //par défaut le formulaire est masqué

            $scope.showColor = false;
            $scope.showBrightness = false;
            $scope.showOpacity = false;
            $scope.showMagnetism = false;
            $scope.showPorosity = false;
            $scope.showcprimicrostructureFamily = false;
            $scope.showmmicrostructureFamily = false;
            $scope.showCohesion = false;
            $scope.showHardness = false;
            $scope.showCracking = false;
            $scope.showScomposition = false;
            $scope.showNmmcomposition = false;
            $scope.showDcomposition = false;
            $scope.showPomcomposition = false;
            $scope.showCpcomposition = false;
            $scope.showCmcomposition = false;
            $scope.showMcomposition = false;
            $scope.showinterfacetransition = false;
            $scope.showinterfaceroughness = false;
            $scope.showinterfaceadherence = false;
            $scope.showCmlevelofcorrosionFamily = false;
            $scope.showcpcompositionextensionfamily = false;
            $scope.showcprimicrostructureaggregatecompositionFamily = false;
            $scope.showcprimicrostructureaggregatecompositionextensionFamily = false;
            $scope.showsubcpcompositionFamily = false;
            $scope.showsubsubcpcompositionFamily = false;
            $scope.showsubcprimicrostructureFamily = false;
            $scope.showsubcprimicrostructureaggregatecompositionFamily = false;
            $scope.showsubsubcprimicrostructureaggregatecompositionFamily = false;
            $scope.showsubcmcompositionFamily = false;
            $scope.showsubcmlevelofcorrosionFamily = false;
            $scope.showsubmmicrostructureFamily = false;
            $scope.showsubmcompositionFamily = false;

            //Quand on accède au détail d'une stratigraphie, la première chose effectuée est le chargement en asynchrone des strates qui constituent cette stratigraphie.
            MiCorrService.getDetailedStratigraphy($scope.stratigraphyName).success(function(data){

                // On parcourt toutes les strates que le service nous a retourné
                for (var i = 0; i < data.length; i++) {
                    var loadedStrata = data[i];
                    // Pour pouvoir générer une strates, il faut au minimum une charactéristique qui est natureFamily. Si elle n'existe pas alors il ne peut pas y avoir de strates
                    if (loadedStrata['characteristics'].length == 0){
                        console.log("Can not load this strata. Probably this strata has no natureFamily characteristics !");
                        alert("Error : Strata '" + loadedStrata.name + "' has no nature characteristics. This strata can not be loaded !");
                    }
                    else { // Si c'est tout bon on génère la strate
                        // On commence par créer une instance de strate qui contient les valeurs des données communes à chaque strates
                        var strata = natureFactory($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "natureFamily"));
                        strata.setNatureFamilyUid($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "natureFamily"));
                        strata.setName(loadedStrata.name);

                        /*
                        * on utilise la méthode getCharacteristicByFamily qui possède deux paramètres
                        * 1) la liste des charactéristiques pour cette strate au format JSON
                        * 2) la famille de characteristiques qu'on veut ressortir
                        * On fait ça comme ça car les données sont une liste au format json
                        * et cette méthode permet de retrouver la bonne charactéristique pour la bonne famille de charactéristique
                        */
                        strata.setShapeFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "shapeFamily"));
                        strata.setWidthFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "widthFamily"));
                        strata.setThicknessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "thicknessFamily"));
                        strata.setContinuityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "continuityFamily"));
                        strata.setDirectionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "directionFamily"));

                        // Puis on charge les données qui sont propres à chaque nature de strate dans l'instance de la strate
                        if (strata.findDependency('colourFamily'))
                            strata.setColourFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "colourFamily"));
                        if (strata.findDependency('brightnessFamily'))
                            strata.setBrightnessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "brightnessFamily"));
                        if (strata.findDependency('opacityFamily'))
                            strata.setOpacityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "opacityFamily"));
                        if (strata.findDependency('magnetismFamily'))
                            strata.setMagnetismFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "magnetismFamily"));
                        if (strata.findDependency('porosityFamily'))
                            strata.setPorosityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "porosityFamily"));
                        if (strata.findDependency('cprimicrostructureFamily'))
                            strata.setCpriMicrostructureFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpriMicrostructureFamily"));
                        if (strata.findDependency('mmicrostructureFamily'))
                            strata.setMmicrostructureFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "mMicrostructureFamily"));
                        if (strata.findDependency('cohesionFamily'))
                            strata.setCohesionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cohesionFamily"));
                        if (strata.findDependency('hardnessFamily'))
                            strata.setHardnessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "hardnessFamily"));
                        if (strata.findDependency('crackingFamily'))
                            strata.setCrackingFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "crackingFamily"));
                        if (strata.findDependency('scompositionFamily'))
                            strata.setScompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "sCompositionFamily"));
                        if (strata.findDependency('nmmcompositionFamily'))
                            strata.setNmmCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "nmmCompositionFamily"));
                        if (strata.findDependency('dcompositionFamily'))
                            strata.setDcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "dCompositionFamily"));
                        if (strata.findDependency('pomcompositionFamily'))
                            strata.setPomCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "pomCompositionFamily"));
                        if (strata.findDependency('cpcompositionFamily'))
                            strata.setCpcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpCompositionFamily"));
                        if (strata.findDependency('cmcompositionFamily'))
                            strata.setCmcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cmCompositionFamily"));
                        if (strata.findDependency('mcompositionFamily'))
                            strata.setMcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "mCompositionFamily"));
                        if (strata.findDependency('cmlevelofcorrosionFamily'))
                            strata.setCmLevelOfCorrosionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cmLevelOfCorrosionFamily"))
                        if (strata.findDependency('cprimicrostructureaggregatecompositionFamily'))
                            strata.setCprimicrostructureaggregateCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpriMicrostructureAggregateCompositionFamily"));

                        // Puis on charge les interfaces dans l'instance de la strate
                        strata.setInterfaceprofileFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceProfileFamily"));
                        if (strata.findDependency('interfacetransitionFamily'))
                            strata.setInterfacetransitionFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceTransitionFamily"));
                        if (strata.findDependency('interfaceroughnessFamily'))
                            strata.setInterfaceroughnessFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceRoughnessFamily"));
                        if (strata.findDependency('interfaceadherenceFamily'))
                            strata.setInterfaceadherenceFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceAdherenceFamily"));

                        //sub
                        // Puis on charge les sous-caractéristiques et sous-sous-caractéristiques
                        var subCharacteristicsList = loadedStrata['subcharacteristics'];
                        if(typeof StrataData.getSubcpcompositionFamily() !== "undefined") {
                            if (strata.findDependency('subcpcompositionFamily'))
                                strata.setSubcpcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcpcompositionFamily()));
                            if (strata.findDependency('subsubcpcompositionFamily'))
                                strata.setSubsubcpcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubsubcpcompositionFamily()));
                            if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily'))
                                strata.setSubcprimicrostructureaggregateCompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcprimicrostructureaggregatecompositionFamily()));
                            if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily'))
                                strata.setSubsubcprimicrostructureaggregateCompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubsubcprimicrostructureaggregatecompositionFamily()));
                            if (strata.findDependency('subcmcompositionFamily'))
                                strata.setSubCmcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcmcompositionFamily()));
                            if (strata.findDependency('subcmlevelofcorrosionFamily'))
                                strata.setSubCmLevelOfCorrosionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcmLevelOfCorrosionFamily()));
                            if (strata.findDependency('submcompositionFamily'))
                                strata.setSubmcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubmcompositionFamily()));


                            // Picklist
                            // on charge les données pour les picklist
                            if (strata.findDependency('subcprimicrostructureFamily'))
                                strata.setSubcprimicrostructureFamily($scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StrataData.getSubcprimicrostructureFamily()));
                            if (strata.findDependency('submmicrostructureFamily'))
                                strata.setSubmmicrostructureFamily($scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StrataData.getSubmmicrostructureFamily()));
                        }
                        if (strata.findDependency('cpcompositionextensionFamily'))
                                strata.setCpcompositionextensionFamily($scope.getCharacteristicByFamilyMulti(loadedStrata['characteristics'], "cpCompositionExtensionFamily"));
                        if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
                            strata.setCprimicrostructureaggregateCompositionextensionFamily($scope.getCharacteristicByFamilyMulti(loadedStrata['characteristics'], "cpriMicrostructureAggregateCompositionExtensionFamily"));


                        // Une fois notre instance de strate créé avec tous les paramètres nécessaires, alors on l'ajoute à notre service.
                        StrataData.pushOneStrata(strata);
                    }
            }}).success(function(){
                $scope.$broadcast('initShowStrat');
            });
        };

        MiCorrService.getAllCharacteristic().success(function(data) {
            if (typeof data !== "undefined") {
                StrataData.clear();
                StrataData.Fill(data);
            }
        }).success(function(){
            initShowStrata();
            ngProgress.complete();
        });

        /*
        *
        * cherche dans une liste une famille et retourne la valeur name de la famille
        * @params data : charactéristique au format json
        *         family : nom de la famille
        * @returns valeur de la charactéristique
        */
        $scope.getCharacteristicByFamily = function(data, family) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].family == family){
                    return data[i].name;
                }
            }
            return "";
        }

        /*
        * cherche dans une liste une famille et retourne tous les valeurs de la famille
        * @params data : charactéristique au format json
        *         family : nom de la famille
        * @returns valeurs de la charactéristique
        */
        $scope.getCharacteristicByFamilyMulti = function(data, family) {
            var t = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].family == family){
                    t.push({'name' : data[i].name});
                }
            }
            return t;
        }

         /*
         * cherche dans une liste (liste de sous-charactéristiques) une valeur et si elle correspond
         * à la valeur donnée en paramètre alors on retourne la sous caractéristique
         * @params sub : sous-charactéristique de cette strate
         *         list : liste des sous caractéristiques pour cette famille
         * @returns valeur de la charactéristique
         */
        $scope.getSubCharacteristicByFamily = function(sub, list) {
            for (var i = 0; i < sub.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (sub[i].name == list[j].name)
                        return sub[i].name;
                }
            }
            return "";
        }

        /*
        * cherche dans une liste (liste de sous-charactéristiques) des valeurs et si elles correspondent
        * à la valeur donnée en paramètre alors on retourne les sous caractéristiques
        * @params sub : sous-charactéristique de cette strate
        *         list : liste des sous caractéristiques pour cette famille
        * @returns valeurs de la caractéristique
        */
        $scope.getSubCharacteristicByFamilyMulti = function(sub, list) {
            var t = [];
            for (var i = 0; i < sub.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (sub[i].name == list[j].name)
                        t.push({'name': sub[i].name});
                    //return sub[i].name;
                }
            }
            return t;
        }


        /*
        * exécute une mise à jour de l'interface après un événement en provenance d'un enfant
        * @params index : index de la strate sélectionnée
        * @returns
        */
        $scope.$on('doUpdate', function(event, index){
            $timeout(function(){// attend que tous les $apply() soient finis avant de faire notre udate
                $scope.update(index); // on donne toujours l'index de la strate sélectionnée pour la mise à jour
            });
        });

        /*
        * exécute une mise à jour de l'interface. On met à jour le formulaire pour être plus précis
        * @params index : index de la strate sélectionnée
        * @returns
        */
        $scope.update = function(index){
            $scope.showTabForms = true; //Affichage de formulaire
            StrataData.setSelectedStrata(index); // on set dans le service quelle est la strate sélectionnée
            $scope.hideShowForms(StrataData.getStratas()[index]);   // On affiche/masque les champs en fonction de la nature de la strate
            $scope.strataName = StrataData.getStratas()[index].getName();   // On affiche le nom de la strate
            $scope.natureFamilyname = StrataData.getStratas()[index].getNatureFamily(); // On affiche la nature de la strate

            // Dans notre formulaire on a des onglets
            // chaque onglet a un controlleur
            // il faut mettre à jour chaque contrôlleur
            $scope.$broadcast('updateMorphology');
            $scope.$broadcast('updateTexture');
            $scope.$broadcast('updateMicrostructure');
            $scope.$broadcast('updateComposition');
            $scope.$broadcast('updateInterface');

            // apply les mises à jour de l'interface
            $scope.$apply();
            $scope.askLeave = true;
        };

        /*
        * Met à jour le formulaire
        */
        $scope.$on('updateFormOnly', function(event){
            $scope.hideShowForms(StrataData.getStratas()[StrataData.getCurrentSelectedStrata()]);
        });

        /*
        * affiche/masque des champs en fonction de la strate
        * @params strata : strate sélectionnée
        */
        $scope.hideShowForms = function(strata) {
            if(strata.getShortNatureFamily()=='CM'){
                $scope.showWidth = false;
                $scope.showThickness = false;
                $scope.showContinuity = false;
                $scope.showDirection = false;
                $scope.showProfile = false;
                $scope.showColor = false;
                $scope.showBrightness = false;
                $scope.showOpacity = false;
                $scope.showMagnetism = false;
                $scope.showPorosity = false;
                $scope.showmmicrostructureFamily = false;
                $scope.showCohesion = false;
                $scope.showHardness = false;
                $scope.showCracking = false;
                $scope.showScomposition = false;
                $scope.showNmmcomposition = false;
                $scope.showDcomposition =  false;
                $scope.showPomcomposition = false;
                $scope.showCpcomposition = false;
                $scope.showCmcomposition = false;
                $scope.showMcomposition = false;
                $scope.showinterfacetransition = false;
                $scope.showinterfaceroughness = false;
                $scope.showinterfaceadherence = false;
                $scope.showCmlevelofcorrosionFamily = false;
                $scope.showcpcompositionextensionfamily = false;
                $scope.showsubcpcompositionFamily = false;
                $scope.showsubsubcpcompositionFamily = false;
                $scope.showsubcmcompositionFamily = false;
                $scope.showsubcmlevelofcorrosionFamily = false;
                $scope.showsubmmicrostructureFamily = false;

                $scope.showcprimicrostructureFamily = false;
                $scope.showsubmcompositionFamily = false;

                $scope.showsubcprimicrostructureFamily = false;
                $scope.showsubcprimicrostructureaggregatecompositionFamily = false;
                $scope.showsubsubcprimicrostructureaggregatecompositionFamily = false;
                $scope.showcprimicrostructureaggregatecompositionFamily = false;
                $scope.showcprimicrostructureaggregatecompositionextensionFamily = false;

            } else {
                $scope.showWidth = strata.findDependency('widthFamily');
                $scope.showThickness = strata.findDependency('thicknessFamily');
                $scope.showContinuity = strata.findDependency('continuityFamily');
                $scope.showDirection = strata.findDependency('directionFamily');
                $scope.showColor = strata.findDependency('colourFamily');
                $scope.showBrightness = strata.findDependency('brightnessFamily');
                $scope.showOpacity = strata.findDependency('opacityFamily');
                $scope.showMagnetism = strata.findDependency('magnetismFamily');
                $scope.showPorosity = strata.findDependency('porosityFamily');
                $scope.showmmicrostructureFamily = strata.findDependency('mmicrostructureFamily');
                $scope.showCohesion = strata.findDependency('cohesionFamily');
                $scope.showHardness = strata.findDependency('hardnessFamily');
                $scope.showCracking = strata.findDependency('crackingFamily');
                $scope.showScomposition = strata.findDependency('scompositionFamily');
                $scope.showNmmcomposition = strata.findDependency('nmmcompositionFamily');
                $scope.showDcomposition = strata.findDependency('dcompositionFamily');
                $scope.showPomcomposition = strata.findDependency('pomcompositionFamily');
                $scope.showCpcomposition = strata.findDependency('cpcompositionFamily');
                $scope.showCmcomposition = strata.findDependency('cmcompositionFamily');
                $scope.showMcomposition = strata.findDependency('mcompositionFamily');
                $scope.showinterfacetransition = strata.findDependency('interfacetransitionFamily');
                $scope.showinterfaceroughness = strata.findDependency('interfaceroughnessFamily');
                $scope.showinterfaceadherence = strata.findDependency('interfaceadherenceFamily');
                $scope.showCmlevelofcorrosionFamily = strata.findDependency('cmlevelofcorrosionFamily');
                $scope.showcpcompositionextensionfamily = strata.findDependency('cpcompositionextensionFamily');
                $scope.showsubcpcompositionFamily = strata.findDependency('subcpcompositionFamily');
                $scope.showsubsubcpcompositionFamily = strata.findDependency('subsubcpcompositionFamily');
                $scope.showsubcmcompositionFamily = strata.findDependency('subcmcompositionFamily');
                $scope.showsubcmlevelofcorrosionFamily = strata.findDependency('subcmlevelofcorrosionFamily');
                $scope.showsubmmicrostructureFamily = strata.findDependency('submmicrostructureFamily');

                $scope.showcprimicrostructureFamily = strata.findDependency('cprimicrostructureFamily');
                $scope.showsubmcompositionFamily = strata.findDependency('submcompositionFamily');

                // on affiche seulement si cprimicrostructure n'est pas égal à noMiccrostructure
                if (strata.findDependency('cprimicrostructureFamily') && strata.getCpriMicrostructureFamily() != "noMicrostructureCharacteristic") {
                    $scope.showsubcprimicrostructureFamily = strata.findDependency('subcprimicrostructureFamily');
                    $scope.showsubcprimicrostructureaggregatecompositionFamily = strata.findDependency('subcprimicrostructureaggregatecompositionFamily');
                    $scope.showsubsubcprimicrostructureaggregatecompositionFamily = strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily');
                    $scope.showcprimicrostructureaggregatecompositionFamily = strata.findDependency('cprimicrostructureaggregatecompositionFamily');
                    $scope.showcprimicrostructureaggregatecompositionextensionFamily = strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily');
                }
                else {
                    $scope.showsubcprimicrostructureFamily = false;
                    $scope.showsubcprimicrostructureaggregatecompositionFamily = false;
                    $scope.showsubsubcprimicrostructureaggregatecompositionFamily = false;
                    $scope.showcprimicrostructureaggregatecompositionFamily = false;
                    $scope.showcprimicrostructureaggregatecompositionextensionFamily = false;
                }
            }

        };

        /*
        * Mise à jour du dessin lors d'un évenement provenant d'un enfant
        */
        $scope.$on('updateDraw', function() {
            $timeout(function(){ // on attend que tous les $apply() soient finis
                /*On force ici la mise à jour des dessins qui sont dans une liste qui sont affichés avec une directive
                 * rstratas contient une liste d'instance de stratigraphies
                 * Si on met à jour une propriété dans notre service, le watch ne verra rien et rien ne sera mis à jour
                 * SI on veut forcer une mise à jour il faut supprimer la référence vers le service qui contient les strates
                 * forcer une mise à jour avec $apply()
                 * récupérer la référence vers les strates du service et enfin refaire une mise à jour avec $apply()*/
                $scope.rstratas = new Array();
                $scope.$apply();
                $scope.rstratas = StrataData.getStratas();
                $scope.$apply();
            });
        });

        /*
        * appelle le service rest qui sauvegarde la stratigraphie en cours de construction
        * est appelé par un événement provenant d'un enfant
        */
        $scope.$on('save', function() {
            var j = JSON.stringify(StrataData.StratasToJson($scope.artefactName, $scope.stratigraphyName));
            console.log(j);
            MiCorrService.saveStratigraphy(encodeURIComponent(j));
            $scope.askLeave = false;
        });
    });
