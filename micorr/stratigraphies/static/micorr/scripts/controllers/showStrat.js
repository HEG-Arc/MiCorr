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

        // Variable mise a false à chaque fois qu'on ouvre une stratigraphie
        $scope.askLeave = false;
        // Quand l'url change on appelle cette méthode
        $scope.$on('$locationChangeStart', function (event) {
            // Si on a modifié quelque chose alors on demande si on veut quitter la page sans sauver
            if ($scope.askLeave == true) {
                var answer = confirm("Are you sure you want to leave this page ?")
                if (!answer) {
                    event.preventDefault();
                }
            }
        });


        //quand on supprime une strate, on se positionne sur la strate 0 et on met à jour le dessin
        $scope.removeStrata = function (index) {
            StrataData.delStrata(index);
            $scope.$emit('doUpdate', 0);
            $scope.$emit('updateDraw');
        };

        /*
         * Déplace une strate vers le haut et met à jour l'interface
         * @params i strate actuelle qui va se faire déplacer
         */
        $scope.movestrataup = function (i) {
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
        $scope.movestratadown = function (i) {
            var current = parseInt(i);
            if (parseInt(StrataData.getCurrentSelectedStrata()) + 1 < StrataData.getStratas().length) {
                StrataData.swapTwoStratas(current, current + 1);
                $scope.$broadcast('doUpdate', current + 1);
                $scope.$broadcast('updateDraw', current + 1);
            }
        };

        var initShowStrata = function () {
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
            $scope.strataName = "No strata selected";         // par défaut aucune strata n'est choisie
            $scope.natureFamilyname = "";                           // par défaut aucune nature n'est choisie

            // ces variables servent à afficher/masquer dans le formulaire les champs appartenants à une nature de matériau
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
            MiCorrService.getDetailedStratigraphy($scope.stratigraphyName).success(function (data) {
                var stratigraphy = new stratigraphy.Stratigraphy();
                stratigraphy.setDescription($scope.stratigraphyName)
                //On parse le JSON pour récupérer le contenu
                var jsonData = JSON.parse(body);
                //Boucle sur les strates
                for (var i = 0; i < jsonData.length; i++) {
                    var strata = new strata.Strata();
                    var currentStrata = jsonData[i];
                    strata.setUid(currentStrata.name);
                    //Boucle sur les characteristiques
                    for (var j = 0; j < currentStrata.characteristics.length; j++) {
                        var currentCharacteristic = currentStrata.characteristics[j];
                        var characteristic = new characteristic.Characteristic();
                        characteristic.setName(currentCharacteristic.name);
                        characteristic.setFamily(currentCharacteristic.family);
                        strata.addCharacteristic(characteristic);
                    }
                    //Boucle sur les sous characteristiques
                    for (var j = 0; j < currentStrata.subcharacteristics.length; j++) {
                        var currentSubCharacteristic = currentStrata.subcharacteristics[j];
                        var subCharacteristic = new subCharacteristic.SubCharacteristic();
                        subCharacteristic.setName(currentSubCharacteristic.name);
                        strata.addSubCharacteristic(subCharacteristic);
                    }
                    stratigraphy.addStrata(strata);
                }
            }).success(function () {
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
         * exécute une mise à jour de l'interface après un événement en provenance d'un enfant
         * @params index : index de la strate sélectionnée
         * @returns
         */
        $scope.$on('doUpdate', function (event, index) {
            $timeout(function () {// attend que tous les $apply() soient finis avant de faire notre udate
                $scope.update(index); // on donne toujours l'index de la strate sélectionnée pour la mise à jour
            });
        });

        /*
         * exécute une mise à jour de l'interface. On met à jour le formulaire pour être plus précis
         * @params index : index de la strate sélectionnée
         * @returns
         */
        $scope.update = function (index) {
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
        $scope.$on('updateFormOnly', function (event) {
            $scope.hideShowForms(StrataData.getStratas()[StrataData.getCurrentSelectedStrata()]);
        });

        /*
         * affiche/masque des champs en fonction de la strate
         * @params strata : strate sélectionnée
         */
        $scope.hideShowForms = function (strata) {

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
            $scope.showinterfaceprofileFamily = strata.findDependency('interfaceprofileFamily');
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

            if (strata.getNatureFamilyUid() == 'mCharacteristic') {
                $scope.showAddCorrodedMetalStrata = true;
            } else {
                $scope.showAddCorrodedMetalStrata = false;
            }

            if (strata.getNatureFamilyUid() == 'cmCharacteristic') {
                $scope.corrodedMetalStrataSelected = true;
                if (typeof $scope.ratio == "undefined")
                    $scope.ratio = strata.ratio;
            } else {
                $scope.corrodedMetalStrataSelected = false;
            }


        };

        /*
         * Mise à jour du dessin lors d'un évenement provenant d'un enfant
         */
        $scope.$on('updateDraw', function () {
            $timeout(function () { // on attend que tous les $apply() soient finis
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
        $scope.$on('save', function () {
            var j = JSON.stringify(StrataData.StratasToJson($scope.artefactName, $scope.stratigraphyName));
            console.log(j);
            MiCorrService.saveStratigraphy(encodeURIComponent(j));
            $scope.askLeave = false;
        });

        $scope.ratio = new Ratio(3);

        $scope.ratioChange = function () {
            //mise à jour du dessin
            $scope.$emit('updateDraw');
        }
    });

