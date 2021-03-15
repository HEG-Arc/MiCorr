'use strict';

import {Strata} from "../business/strata";
import {Characteristic} from "../business/characteristic";
import {SubCharacteristic} from "../business/subCharacteristic";

import {GraphGenerationUtil} from "../utils/graphGenerationUtil";
import {Ratio, returnNatureCharacteristic} from "../init";
/**
 * @ngdoc function
 * @name micorrApp.controller:ShowStratCtrl
 * @description
 * # ShowStratCtrl
 * Controlleur qui est appelé lors de l'affichage d'une stratigraphie
 */
angular.module('micorrApp')
    .controller('ShowStratCtrl', function ($scope, $routeParams, $timeout, MiCorrService, StratigraphyData, ngProgress) {

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
            StratigraphyData.getStratigraphy().delStratum(index);
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
                StratigraphyData.getStratigraphy().swapTwoStrata(current, current - 1);
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
                StratigraphyData.getStratigraphy().swapTwoStrata(current, current + 1);
                $scope.$broadcast('doUpdate', current + 1);
                $scope.$broadcast('updateDraw', current + 1);
            }
        };

        /*
         * filter families or fieldsets in familyGroup
         * based on current observation mode and current stratum nature
         */
        $scope.showFamily = function (family)
        {
            let showBasedOnObservation = $scope.observationMode.binocular ? family.observation & 1 : family.observation & 2;
            if (showBasedOnObservation)
            {
                let index = parseInt(StratigraphyData.getSelectedStrata());
                let selectedStratumNature  = StratigraphyData.getStratigraphy().getStratas()[index].natureUID;
                if (family.natures) { // family is a family object direct visibility test for current nature
                    return family.natures.length==0 || family.natures.includes(selectedStratumNature);
                }
                if (family.families) { //here family is fieldset object we show the fieldset if any of its families
                    return family.families.some(f => !f.natures || f.natures.length==0 || f.natures.includes(selectedStratumNature));
                }
            }
            return showBasedOnObservation;
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
                $scope.$apply(function (){
                    $scope.activeTabInterface = val;
                    $scope.activeMorphologyTab = !val;
                })
            };

            $scope.artefactName = $routeParams.artefact;        // nom de l'artefact
            $scope.stratigraphyName = $routeParams.strat;           // nom de la stratigraphie
            $scope.stratigraphyDescription = $routeParams.stratigraphyDescription; // description de la stratigraphie
            $scope.strataName = "No strata selected";         // par défaut aucune strata n'est choisie
            $scope.observationMode = {binocular:true};

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
            $scope.shownmmComposition = false;
            $scope.showDcomposition = false;
            $scope.showPomcomposition = false;

            $scope.showinterfacetransition = false;
            $scope.showinterfaceroughness = false;
            $scope.showinterfaceadherence = false;
            $scope.showCmlevelofcorrosionFamily = false;

            $scope.showsubcprimicrostructureFamily = false;

            $scope.showsubcmlevelofcorrosionFamily = false;
            $scope.showsubmmicrostructureFamily = false;


            //Chargement de la stratigraphie
            MiCorrService.getDetailedStratigraphy($scope.stratigraphyName, function (response) {

                 /*
                 * cherche dans une liste (liste de sous-charactéristiques) une valeur et si elle correspond
                 * à la valeur donnée en paramètre alors on retourne la sous caractéristique
                 * @params sub : sous-charactéristique de cette strate
                 *         list : liste des sous caractéristiques pour cette famille
                 * @returns valeur de la charactéristique
                 */
                 // for subCharacteristics there is no "real"/graph model Family so for now we still filter
                // through the list of all subcharacteristics sorted by Characteristic Family and relationship level
                // for ex. 'subcpcompositionFamily' is not a family Node uid in the graph db but just means 1st level
                // Subcharacteristics of 'cpCompositionFamily'
                // todo refactoring: just synthesize and add this pseudo family to data on load from the graph
                // todo and remove all these repeated filtering loops
                let data =response.data;
                function getSubCharacteristicByFamily(sub, list) {
                    for (var i = 0; i < sub.length; i++) {
                        for (var j = 0; j < list.length; j++) {
                            if (sub[i].name == list[j].uid || sub[i].name == list[j].name)
                                return sub[i];
                        }
                    }
                    return undefined;
                }

                function getSubCharacteristicByFamilyMulti(sub, list) {
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

                var st = StratigraphyData.getStratigraphy();
                st.setUid($scope.stratigraphyName);
                st.setArtefact($scope.artefactName);
                $scope.stratigraphyDescription =  $scope.stratigraphyDescription || data.description;
                if ($scope.stratigraphyDescription != undefined) {
                    st.setDescription($scope.stratigraphyDescription)
                }
                //Boucle sur les strates
                for (var i = 0; i < data.strata.length; i++) {
                    var currentStrata = data.strata[i];
                    var nature = StratigraphyData.getStrataNature(currentStrata);
                    var str = new Strata(nature, false);
                    str.setUid(currentStrata.name);
                    str.setIndex(i);
                    if (st.getDescription() != undefined) {
                        str.setName(st.getDescription() + '_strata_' + str.getIndex());
                    }
                 //Boucle sur les caracteristiques
                    for (let j = 0; j < currentStrata.characteristics.length; j++) {
                        str.addCharacteristic(new Characteristic(currentStrata.characteristics[j]));
                    }

                    //Boucle sur les caracteristiques d'interface
                    if ('characteristics' in currentStrata.interfaces)
                        for (let j = 0; j < currentStrata.interfaces.characteristics.length; j++) {
                            let char = new Characteristic(currentStrata.interfaces.characteristics[j]);
                            str.replaceCharacteristic(char);
                        }
                    //Récupération des sous caractéristiques:
                    var subCharacteristicsList = currentStrata['subcharacteristics'];
                    var sChar;

                    // new subcharacteristic data loaded with parent family information for dynamic conversion
                    for (let sc of subCharacteristicsList) {
                        if (sc.family) {
                            str.addSubCharacteristic(new SubCharacteristic(sc.family,  sc))
                        }
                    }
                     // secondary Components
                    if (currentStrata.secondaryComponents)
                        for (let component of currentStrata.secondaryComponents) {
                            for (let c of component.characteristics)
                                str.addCharacteristic(new Characteristic(c), str.secondaryComponents[0].characteristics)
                            for (let sc of component.subCharacteristics) {
                                if (sChar = getSubCharacteristicByFamily([sc], StratigraphyData.getSubcpcompositionFamily()))
                                    str.addCharacteristic(new SubCharacteristic('subcpcompositionFamily', sc), str.secondaryComponents[0].subCharacteristics);
                                else if (sChar = getSubCharacteristicByFamily([sc], StratigraphyData.getSubsubcpcompositionFamily()))
                                    str.addCharacteristic(new SubCharacteristic('subsubcpcompositionFamily', sc), str.secondaryComponents[0].subCharacteristics);
                                else
                                    console.log(`ignoring unexpected subCharacteristic:${sc.name} in secondaryComponent`);
                            }
                            if (component.containers)
                                str.secondaryComponents[0].containers = component.containers;
                        }
                    // Element containers
                    if (currentStrata.containers) {
                        str.containers = currentStrata.containers
                    }
                    // Variables
                    if (currentStrata.variables) {
                        str.variables = currentStrata.variables
                    }

                    //Récupération des strates enfant
                    for (var j = 0; j < currentStrata.children.length; j++) {
                        var curChild = currentStrata.children[j];
                        var nat = StratigraphyData.getStrataNature(curChild);
                        var childStrata = new Strata(nat, true);
                        childStrata.setUid(curChild.name);
                        //Boucle sur les caracteristiques
                        for (let k = 0; k < curChild.characteristics.length; k++) {
                            childStrata.addCharacteristic(new Characteristic(curChild.characteristics[k]));
                        }
                        str.addChildStrata(childStrata);
                    }

                    /*Si la strate n'a pas d'enfants et que c'est une strate CM, on lui ajoute ses deux
                     enfants. Celà permet de transformer les anciennes strates qui auraient été enregistrées
                     avant l'instauration des strates enfants. */
                    if (str.getNature() == 'Corroded metal' && currentStrata.children.length == 0) {
                        //Ajout de la sous strate CP
                        var cpNature = returnNatureCharacteristic('CP');
                        var childCPStrata = new Strata(cpNature.getRealName(), true);
                        childCPStrata.replaceCharacteristic(cpNature);
                        childCPStrata.setUid(str.getUid() + '_childCP');
                        str.addChildStrata(childCPStrata);

                        //Ajout de la sous strate M
                        var mNature = returnNatureCharacteristic('M');
                        var childMStrata = new Strata(mNature.getRealName(), true);
                        childMStrata.replaceCharacteristic(mNature);
                        childMStrata.setUid(str.getUid() + '_childM');
                        str.addChildStrata(childMStrata);
                    }

                    st.addStratum(str);
                }


                $scope.stratas = st.getStratas();
                $scope.stratigraphy = st;
                $scope.StratigraphyData = StratigraphyData;

            }).then(function () {
                $scope.$broadcast('initShowStrat');
                ngProgress.complete();
            });
        };
        MiCorrService.getFamilyDescriptions().then(function (response) {
            let descriptions=response.data;
            MiCorrService.getAllCharacteristic().then(function (response) {
                if (typeof response.data !== "undefined") {
                    StratigraphyData.fill(response.data, descriptions);
                }
            }).then(function () {
                initShowStrata();
                ngProgress.complete();
            });
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
            $scope.$apply(function () {
                var stratig = StratigraphyData.getStratigraphy();
                var strat = stratig.getStratas()[index];
                StratigraphyData.setSelectedStrata(index); // On indique au service la strate sélectionnée
                $scope.showTabForms = true; //Affichage de formulaire

                $scope.highlightSelected();

                if (strat != undefined) {
                    $scope.strataName = strat.getLabel();
                    $scope.natureFamilyname = strat.getNature();


                    // Dans notre formulaire on a des onglets
                    // chaque onglet a un controlleur
                    // il faut mettre à jour chaque contrôlleur
                    $scope.$broadcast('updateMorphology');
                    $scope.$broadcast('updateTexture');
                    $scope.$broadcast('updateMicrostructure');
                    $scope.$broadcast('updateComposition');
                    $scope.$broadcast('updateInterface');

                }
                $scope.askLeave = true;
            });
        };

        /**
         * Cette méthode ne regénère que l'interface modifié
         */
        $scope.$on('updateSelectedInterface', function () {
            var graphGenUtil = new GraphGenerationUtil(null, StratigraphyData.getStratigraphy());

            var index = parseInt(StratigraphyData.getSelectedStrata());
            var strata = StratigraphyData.getStratigraphy().getStratas()[index];
            var intDivName = 'strataInterface' + index;
            var interfaceDiv = document.getElementById(intDivName);
            interfaceDiv.innerHTML = '';
            graphGenUtil.drawInterface(strata, intDivName);
        });
        /**
         * Cette méthode permet de régénérer uniquement la strate modifiée
         * et la couche CM qui se base dessus (s'il en existe une)
         */
        $scope.$on('updateSelectedStrata', function () {
            var index = parseInt(StratigraphyData.getSelectedStrata());
            var strata = StratigraphyData.getStratigraphy().getStratas()[index];

            //on donne le nom des divs concernées pour les récupérer
            var intDivName = 'strataInterface' + index;
            var strDivName = 'strata' + index;

            var graphGenUtil = new GraphGenerationUtil(null, StratigraphyData.getStratigraphy());
            var interfaceDiv = document.getElementById(intDivName);
            var strataDiv = document.getElementById(strDivName);

            //On vide le contenu de la div et on redessine la strate
            interfaceDiv.innerHTML = '';
            strataDiv.innerHTML = '';
            graphGenUtil.drawInterface(strata, intDivName);
            graphGenUtil.drawStrata(strata, strDivName);


            //On vérifie ensuite s'il y a une strate de type CM par dessus ou par dessous
            if (strata.index > 0) {
                var upperStrata = StratigraphyData.getStratigraphy().getStratas()[index - 1];
                if (upperStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
                    //On génère la strate CM du dessus
                    intDivName = 'strataInterface' + (index - 1);
                    strDivName = 'strata' + (index - 1);
                    interfaceDiv = document.getElementById(intDivName);
                    strataDiv = document.getElementById(strDivName);
                    interfaceDiv.innerHTML = '';
                    strataDiv.innerHTML = '';
                    graphGenUtil.drawInterface(upperStrata, intDivName);
                    graphGenUtil.drawStrata(upperStrata, strDivName);
                }
            }

            if (strata.index < StratigraphyData.getStratigraphy().getStratas().length - 1) {

                //De toute façon on regénère la strate du dessous car elle est liée à cette strate
                var lowerStrata = StratigraphyData.getStratigraphy().getStratas()[index + 1];
                intDivName = 'strataInterface' + (index + 1);
                interfaceDiv = document.getElementById(intDivName);
                interfaceDiv.innerHTML = '';
                graphGenUtil.drawInterface(lowerStrata, intDivName);

                if (lowerStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
                    //On génère la strate CM du dessous
                    strDivName = 'strata' + (index + 1);
                    strataDiv = document.getElementById(strDivName);
                    strataDiv.innerHTML = '';
                    graphGenUtil.drawStrata(lowerStrata, strDivName);
                }
            }

        });
        /*
         * Mise à jour du dessin lors d'un évenement provenant d'un enfant
         * Il faut absolument créer un nouveau tableau pour le tableau de strates
         * car sinon la directive ne détecte pas de changement au niveau du $scope
         * et le dessin ne se met pas à jour.
         */
        $scope.$on('updateDraw', function () {
            $timeout(function () {

                $scope.stratigraphy = StratigraphyData.getStratigraphy();
                $scope.stratas = [];
                $scope.stratas = StratigraphyData.getStratigraphy().getStratas();
                $scope.highlightSelected();
            });
        });

        $scope.toPng = function () {

            MiCorrService.exportStratigraphy(StratigraphyData.getStratigraphy().getUid(), 'png').then(function(response) {

            });

        };
        /**
         * Cette méthode met en évidence les infos de la strate sélectionnée
         */
        $scope.highlightSelected = function () {
            var index = StratigraphyData.getSelectedStrata();

            for (var i = 0; i < StratigraphyData.getStratigraphy().getStratas().length; i++) {
                var thisDiv = document.getElementById('stratasvg_' + i);
                thisDiv.classList.remove('current_strata');
            }
            var infoElement = document.getElementById('stratasvg_' + index);
            if (infoElement != undefined) {
                infoElement.classList.add('current_strata');
            }
        };
        /*
         * appelle le service rest qui sauvegarde la stratigraphie en cours de construction
         * est appelé par un événement provenant d'un enfant
         */
        $scope.$on('save', function () {
            var j = JSON.stringify($scope.stratigraphy.toJson());
            console.log(`saving stratigraphy "${$scope.stratigraphy.description}" [${$scope.stratigraphy.uid}]`);

            MiCorrService.saveStratigraphy(j);
            $scope.askLeave = false;
        });
    }).filter('showCharacteristic', function () {
    /* filter characteristics in family
     * based on current strata Nature and Family filter
     */
    return function (characteristics, StratigraphyData, family) {

        let index = parseInt(StratigraphyData.getSelectedStrata());
        let selectedStratum = StratigraphyData.getStratigraphy().getStratas()[index];
        let familyFilter = family.IS_LIST_OF ? family.IS_LIST_OF.filter : null;
        let [filterKey, filterValue] = [null, null];
        if (familyFilter) {
            // e.g familyFilter = "optgroup=Grey"
            [filterKey, filterValue] = familyFilter.split('=');
        }

        function filterTest(characteristic) {
            if (familyFilter && characteristic[filterKey] && characteristic[filterKey] != filterValue)
                return false;
            if (characteristic.natures && characteristic.natures.length) {
                return characteristic.natures.includes(selectedStratum.natureUID);
                //console.log('showCharacteristic(%s, [%s]) on %s stratum = %o',characteristic.name, characteristic.natures.join(','), selectedStratum.natureUID, result);
                //return result;
            }
            return true;
        }

        if (!characteristics)
            console.log('showCharacteristic(undefined, %s) on %s stratum', family.uid, selectedStratum.natureUID);
        return characteristics ? characteristics.filter(filterTest) : [];
    }
});

