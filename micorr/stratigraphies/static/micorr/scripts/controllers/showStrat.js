'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ShowStratCtrl
 * @description
 * # ShowStratCtrl
 * Controlleur qui est appelé lors de l'affichage d'une stratographie
 */
angular.module('micorrApp')
    .controller('ShowStratCtrl', function ($scope, $routeParams, $timeout, MiCorrService, StrataData, StratigraphyData, ngProgress) {

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
            StratigraphyData.delStrata(index);
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
                StratigraphyData.swapTwoStratas(current, current - 1);
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
            if (current + 1 < StratigraphyData.getStratigraphy().getStratas().length) {
                StratigraphyData.swapTwoStratas(current, current + 1);
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



            //Chargement de la stratigraphie
            MiCorrService.getDetailedStratigraphy($scope.stratigraphyName).success(function (data) {

                var st = StratigraphyData.getStratigraphy();
                st.setUid($scope.stratigraphyName);
                st.setArtefact($scope.artefactName);
                if($scope.stratigrapgydescription !=undefined){
                    st.setDescription($scope.stratigrapgydescription)
                }

                //Boucle sur les strates
                for (var i = 0; i < data.length; i++) {

                    var currentStrata = data[i];
                    var nature = StratigraphyData.getStrataNature(currentStrata);
                    var str = new strata.Strata(nature, false);
                    str.setUid(currentStrata.name);
                    str.setIndex(i);
                    if(st.getDescription() != undefined){
                        str.setName(st.getDescription() + '_strata_' + str.getIndex());
                    }
                    //Boucle sur les caracteristiques
                    for (var j = 0; j < currentStrata.characteristics.length; j++) {
                        var currentCharacteristic = currentStrata.characteristics[j];
                        var char = new characteristic.Characteristic();
                        char.setName(currentCharacteristic.name);
                        char.setRealName(currentCharacteristic.real_name);
                        char.setFamily(currentCharacteristic.family);
                        str.addCharacteristic(char);
                    }

                    //Boucle sur les caracteristiques d'interface
                    for (var j = 0; j < currentStrata.interfaces.characteristics.length; j++) {
                        var currentCharacteristic = currentStrata.interfaces.characteristics[j];
                        var char = new characteristic.Characteristic();
                        char.setName(currentCharacteristic.name);
                        char.setFamily(currentCharacteristic.family);
                        char.setInterface(true);

                        //Si c'est une caracteristique d'une de ces familles on peut en ajouter plusieurs
                        if (char.getFamily() == "cpcompositionextensionFamily" || char.getFamily() == "cprimicrostructureaggregatecompositionextensionFamily") {
                            str.addCharacteristic(char)
                        }
                        else {
                            //Sinon, il n'y en a que une donc on la remplace
                            str.replaceCharacteristic(char);
                        }
                    }

                    //Récupération des sous caractéristiques:
                    var subCharacteristicsList = currentStrata['subcharacteristics'];

                    if (str.findDependency('subcpcompositionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubcpcompositionFamily());

                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subcpcompositionFamily');
                            subChar.setUid(sChar.name);
                            subChar.setName(sChar.real_name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {

                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }

                    if (str.findDependency('subsubcpcompositionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubsubcpcompositionFamily());
                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subsubcpcompositionFamily');
                            subChar.setName(sChar.real_name);
                            subChar.setUid(sChar.name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {
                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }

                    /* PLUS UTILISE
                    if (str.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubcprimicrostructureaggregatecompositionFamily());
                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subcprimicrostructureaggregatecompositionFamily');
                            subChar.setName(sChar.real_name);
                            subChar.setUid(sChar.name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {
                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }



                    if (str.findDependency('subcmcompositionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubcmcompositionFamily());
                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subcmcompositionFamily');
                            subChar.setName(sChar.real_name);
                            subChar.setUid(sChar.name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {
                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }
                    */
                    if (str.findDependency('subcmlevelofcorrosionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubcmLevelOfCorrosionFamily());
                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subcmlevelofcorrosionFamily');
                            subChar.setName(sChar.real_name);
                            subChar.setUid(sChar.name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {
                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }

                    if (str.findDependency('submcompositionFamily')) {
                        var sChar = $scope.getSubCharacteristicByFamily(subCharacteristicsList, StratigraphyData.getSubmcompositionFamily());
                        if (sChar != undefined) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('submcompositionFamily');
                            subChar.setName(sChar.real_name);
                            subChar.setUid(sChar.name);
                            if (subChar.getUid() != "" && subChar.getUid() != undefined) {
                                str.addSubCharacteristic(subChar);
                            }
                        }
                    }


                    //Chargement des données pour la picklist
                    if (str.findDependency('subcprimicrostructureFamily')) {
                        var sChars = $scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StratigraphyData.getSubcprimicrostructureFamily());
                        for (var j = 0; j < sChars.length; j++) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('subcprimicrostructureFamily');
                            subChar.setName(sChars[j].real_name);
                            subChar.setUid(sChars[j].name);
                            str.addSubCharacteristic(subChar);
                        }
                    }
                    if (str.findDependency('submmicrostructureFamily')) {
                        var sChars = $scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StratigraphyData.getSubmmicrostructureFamily());

                        for (var j = 0; j < sChars.length; j++) {
                            var subChar = new subCharacteristic.SubCharacteristic();
                            subChar.setFamily('submmicrostructureFamily');
                            subChar.setName(sChars[j].real_name);
                            subChar.setUid(sChars[j].name);
                            str.addSubCharacteristic(subChar);
                        }
                    }


                    //Récupération des strates enfant
                    for (var j = 0; j < currentStrata.children.length; j++) {
                        var curChild = currentStrata.children[j];
                        var nat = StratigraphyData.getStrataNature(curChild);
                        var childStrata = new strata.Strata(nat, true);
                        childStrata.setUid(curChild.name);
                        //Boucle sur les caracteristiques
                        for (var k = 0; k < curChild.characteristics.length; k++) {
                            var curChar = curChild.characteristics[k];
                            var char = new characteristic.Characteristic();
                            char.setName(curChar.name);
                            char.setRealName(curChar.real_name);
                            char.setFamily(curChar.family);
                            childStrata.addCharacteristic(char);
                        }
                        str.addChildStrata(childStrata);
                    }

                    /*Si la strate n'a pas d'enfants et que c'est une strate CM, on lui ajoute ses deux
                     enfants. Celà permet de transformer les anciennes strates qui auraient été enregistrées
                     avant l'instauration des strates enfants. */
                    if (str.getNature() == 'Corroded metal' && currentStrata.children.length == 0) {
                        //Ajout de la sous strate CP
                        var cpNature = returnNatureCharacteristic('CP');
                        var childCPStrata = new strata.Strata(cpNature.getRealName(), true);
                        childCPStrata.replaceCharacteristic(cpNature);
                        childCPStrata.setUid(str.getUid() + '_childCP');
                        str.addChildStrata(childCPStrata);

                        //Ajout de la sous strate M
                        var mNature = returnNatureCharacteristic('M');
                        var childMStrata = new strata.Strata(mNature.getRealName(), true);
                        childMStrata.replaceCharacteristic(mNature);
                        childMStrata.setUid(str.getUid() + '_childM');
                        str.addChildStrata(childMStrata);
                    }

                    st.addStrata(str);
                }


                $scope.stratas = st.getStratas();
                $scope.stratigraphy = st;

            }).success(function () {
                $scope.$broadcast('initShowStrat');
                ngProgress.complete();
            });
        };

        MiCorrService.getAllCharacteristic().success(function (data) {

            if (typeof data !== "undefined") {
                // StrataData.clear();
                StratigraphyData.Fill(data);

            }
        }).success(function () {
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
         * cherche dans une liste (liste de sous-charactéristiques) une valeur et si elle correspond
         * à la valeur donnée en paramètre alors on retourne la sous caractéristique
         * @params sub : sous-charactéristique de cette strate
         *         list : liste des sous caractéristiques pour cette famille
         * @returns valeur de la charactéristique
         */
        $scope.getSubCharacteristicByFamily = function (sub, list) {
            for (var i = 0; i < sub.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (sub[i].name == list[j].uid || sub[i].name == list[j].name)
                        return sub[i];
                }
            }
            return undefined;
        }


        $scope.getSubCharacteristicByFamilyMulti = function (sub, list) {
            var t = [];
            for (var i = 0; i < sub.length; i++) {
                for (var j = 0; j < list.length; j++) {
                    if (sub[i].name == list[j].name || sub[i].name == list[j].uid)
                        t.push(sub[i]);
                    //return sub[i].name;
                }
            }
            return t;
        }

        /*
         * cherche dans une liste (liste de sous-charactéristiques) des valeurs et si elles correspondent
         * à la valeur donnée en paramètre alors on retourne les sous caractéristiques
         * @params sub : sous-charactéristique de cette strate
         *         list : liste des sous caractéristiques pour cette famille
         * @returns valeurs de la caractéristique
         */
        $scope.getCharacteristicByFamilyMulti = function (data, family) {
            var t = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].family == family) {
                    t.push({'name': data[i].name});
                }
            }
            return t;
        }

        /*
         * exécute une mise à jour de l'interface. On met à jour le formulaire pour être plus précis
         * @params index : index de la strate sélectionnée
         * @returns
         */
        $scope.update = function (index) {
            var stratig = StratigraphyData.getStratigraphy();
            var strat = stratig.getStratas()[index];
            $scope.showTabForms = true; //Affichage de formulaire
            StratigraphyData.setSelectedStrata(index); // On indique au service la strate sélectionnée

            $scope.hideShowForms(strat);
            $scope.strataName = strat.getName();
            $scope.natureFamilyname = strat.getNature();


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
            $scope.hideShowForms(StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()]);
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
            var noMicrostructure = false;
            if (strata.getCharacteristicsByFamily("cpriMicrostructureFamily").length > 0) {
                if (strata.getCharacteristicsByFamily("cpriMicrostructureFamily")[0].getName() == "noMicrostructureCharacteristic") {
                    noMicrostructure = true;
                }
            }
            else {
                noMicrostructure = true;
            }

            if (strata.findDependency('cprimicrostructureFamily') && !noMicrostructure) {
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

            if (strata.getNature() == 'Metal') {
                $scope.showAddCorrodedMetalStrata = true;
            } else {
                $scope.showAddCorrodedMetalStrata = false;
            }


            if (strata.getNature() == 'Corroded metal') {

                $scope.corrodedMetalStrataSelected = true;
                if (typeof $scope.ratio == "undefined") {
                    var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
                    ratio = parseInt(ratio.substr(1));
                    $scope.ratio = new Ratio(ratio);
                }

            } else {
                $scope.corrodedMetalStrataSelected = false;
            }

            /*
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
             */

            /*
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
             */


        };

        /*
         * Mise à jour du dessin lors d'un évenement provenant d'un enfant
         * Il faut absolument créer un nouveau tableau pour le tableau de strates
         * car sinon la directive ne détecte pas de changement au niveau du $scope
         * et le dessin ne se met pas à jour.
         */
        $scope.$on('updateDraw', function () {
            $timeout(function () {

                $scope.stratigraphy = StratigraphyData.getStratigraphy();
                $scope.stratas = new Array();
                $scope.$apply();
                $scope.stratas = StratigraphyData.getStratigraphy().getStratas();
                $scope.$apply();
            });
        });

        /*
         * appelle le service rest qui sauvegarde la stratigraphie en cours de construction
         * est appelé par un événement provenant d'un enfant
         */
        $scope.$on('save', function () {
            var test = $scope.stratigraphy.toJson();
            var j = JSON.stringify($scope.stratigraphy.toJson());
            console.log(j);

            MiCorrService.saveStratigraphy(encodeURIComponent(j));
            $scope.askLeave = false;
        });
    });
