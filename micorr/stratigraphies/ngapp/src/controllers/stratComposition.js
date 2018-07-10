'use strict';

import {Characteristic} from "../business/characteristic";
import {
    getSelectedFamilyCharacteristic, Ratio
} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratCompositionCtrl
 * @description
 * # StratCompositionCtrl
 * Contrôlleur qui s'occupe de l'onglet de la composition
 */
angular.module('micorrApp')
    .controller('StratCompositionCtrl', function ($scope, $route, $window, StratigraphyData) {

         /**
         * Cette fonction vide les champs et est appelée à chaque chargement du formulaire
         * pour éviter de garder des anciennes valeurs
         */
        function emptyFields() {
            $scope.selectedScompositionFamily = null;
            $scope.selectedNmmcompositionFamily = null;
            $scope.selectedDcompositionFamily = null;
            $scope.selectedPomcompositionFamily = null;
        }
        emptyFields();
        $scope.filterCompoundsMethodOptions = [{value: "exact", text: "having exact composition"},
                {value: "atleast", text: "with at least composition elements"},
                {value: "any", text: "having any of the composition elements"}];
        $scope.filterCompoundsMethod = {
            options: $scope.filterCompoundsMethodOptions,
            selected :  $scope.filterCompoundsMethodOptions[0]
        };
        // $scope.filterCompoundsMethod.selected = $scope.filterCompoundsMethod.options[0];


        function CharacteristicsSelector(family)
        /**
         * construct an objet like : {characteristics:StratigraphyData[family];characteristics, selected:[]};
         * @param family
         * @constructor
         */ {
            this.characteristics = StratigraphyData[family].characteristics;
            this.selected = [];
        }

        function ElementSelector()
        /**
         * specialized CharacteristicsSelector for elementFamily
         * @constructor
         */ {
            CharacteristicsSelector.apply(this, ["elementFamily"]);
        }

        function CompoundSelector()
        /**
         * specialized CharacteristicsSelector for compoundFamily
         * @constructor
         */ {
            CharacteristicsSelector.apply(this, ["compoundFamily"]);
        }
        var initStratComposition = function () {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.scompositionFamily = StratigraphyData.getScompositionFamily()['characteristics'];
            $scope.nmmCompositionFamily = StratigraphyData.getNmmcompositionFamily()['characteristics'];
            $scope.dcompositionFamily = StratigraphyData.getDcompositionFamily()['characteristics'];
            $scope.pomcompositionFamily = StratigraphyData.getPomcompositionFamily()['characteristics'];

            $scope.pomCompositionMetallicPollutants = new ElementSelector();
            $scope.nmmCompositionNonOrganicElements = new ElementSelector();
            $scope.mCompositionMainElements = new ElementSelector();
            $scope.mCompositionSecondaryElements = new ElementSelector();
            $scope.sCompositionMainElements = new ElementSelector();
            $scope.sCompositionSecondaryElements = new ElementSelector();
            $scope.dCompositionMainElements = new ElementSelector();
            $scope.dCompositionSecondaryElements = new ElementSelector();

            $scope.cpCompositionMainElements = new ElementSelector();
            $scope.cpCompositionSecondaryElements = new ElementSelector();
            $scope.cpCompositionCompounds =  new CompoundSelector();
            // list of secondary components for Microstructure composition for ex.
             $scope.secondaryComponents = [{
             }];
            $scope.secondaryComponents[0].mainElements = new ElementSelector();
            $scope.secondaryComponents[0].secondaryElements = new ElementSelector();
            $scope.secondaryComponents[0].compounds = new CompoundSelector();
            $scope.secondaryComponents[0].additionalElements = new ElementSelector();
            $scope.secondaryComponents[0].filterCompoundsMethod = {
                options: $scope.filterCompoundsMethodOptions,
                selected: $scope.filterCompoundsMethodOptions[0]
            };



            $scope.cpCompositionAdditionalElements = new ElementSelector();

            $scope.cmmCompositionAdditionalElements = new ElementSelector();
            $scope.cmcpCompositionAdditionalElements = new ElementSelector();
            $scope.cmcpagCompositionAdditionalElements = new ElementSelector();

            $scope.descriptions = StratigraphyData.descriptions;
        };

        $scope.$on('initShowStrat', function (event) {
            initStratComposition();
        });

        $scope.upMulti = function () {
            $scope.upComposition();
        };

        /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         * @params
         * @returns
         */
        $scope.$on('updateComposition', function () {


            emptyFields();
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            $scope.selectedScompositionFamily = getSelectedFamilyCharacteristic(strata, "sCompositionFamily", $scope.scompositionFamily);
            $scope.selectedNmmcompositionFamily = getSelectedFamilyCharacteristic(strata, "nmmCompositionFamily", $scope.nmmCompositionFamily);
            $scope.selectedDcompositionFamily = getSelectedFamilyCharacteristic(strata, "dCompositionFamily", $scope.dcompositionFamily);
            $scope.selectedPomcompositionFamily = getSelectedFamilyCharacteristic(strata, "pomCompositionFamily", $scope.pomcompositionFamily);

            $scope.pomCompositionMetallicPollutants.selected = strata.getContainerElements("pomCompositionMetallicPollutants");
            $scope.nmmCompositionNonOrganicElements.selected = strata.getContainerElements("nmmCompositionNonOrganicElements");
            $scope.mCompositionMainElements.selected = strata.getContainerElements("mCompositionMainElements");
            $scope.mCompositionSecondaryElements.selected = strata.getContainerElements("mCompositionSecondaryElements");
            $scope.sCompositionMainElements.selected = strata.getContainerElements("sCompositionMainElements");
            $scope.sCompositionSecondaryElements.selected = strata.getContainerElements("sCompositionSecondaryElements");
            $scope.dCompositionMainElements.selected = strata.getContainerElements("dCompositionMainElements");
            $scope.dCompositionSecondaryElements.selected = strata.getContainerElements("dCompositionSecondaryElements");
            $scope.cpCompositionMainElements.selected = strata.getContainerElements("cpCompositionMainElements");
            $scope.cpCompositionSecondaryElements.selected = strata.getContainerElements("cpCompositionSecondaryElements");
            $scope.cpCompositionCompounds.selected = strata.getContainerElements("cpCompositionCompounds");

            $scope.cpCompositionAdditionalElements.selected = strata.getContainerElements("cpCompositionAdditionalElements");

            $scope.secondaryComponents[0].mainElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionMainElements");
            $scope.secondaryComponents[0].secondaryElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionSecondaryElements");
            $scope.secondaryComponents[0].compounds.selected = strata.getSecondaryComponentContainerElements("cpCompositionCompounds");
            $scope.secondaryComponents[0].additionalElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionAdditionalElements");

            if (strata.getCharacteristicsByFamily('cmCorrosionRatioFamily').length > 0) {
                var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
                ratio = parseInt(ratio.substr(1));
                $scope.ratio = new Ratio(ratio);
            }

            //Reprise des characteristiques de composition pour la strate CM
            if (strata.getNature() == 'Corroded metal') {
                $scope.cmmCompositionAdditionalElements.selected = strata.getContainerElements("cmmCompositionAdditionalElements");
                $scope.cmcpCompositionAdditionalElements.selected = strata.getContainerElements("cmcpCompositionAdditionalElements");
                $scope.cmcpagCompositionAdditionalElements.selected = strata.getContainerElements("cmcpagCompositionAdditionalElements");
            }

        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upComposition = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            strata.updateCharacteristic('sCompositionFamily', $scope.selectedScompositionFamily);
            strata.updateCharacteristic('nmmCompositionFamily',$scope.selectedNmmcompositionFamily);
            strata.updateCharacteristic('dCompositionFamily',$scope.selectedDcompositionFamily);
            strata.updateCharacteristic('pomCompositionFamily',$scope.selectedPomcompositionFamily);
            strata.setContainerElements('pomCompositionMetallicPollutants',$scope.pomCompositionMetallicPollutants.selected);
            strata.setContainerElements('nmmCompositionNonOrganicElements',$scope.nmmCompositionNonOrganicElements.selected);
            strata.setContainerElements('mCompositionMainElements', $scope.mCompositionMainElements.selected);
            strata.setContainerElements('mCompositionSecondaryElements', $scope.mCompositionSecondaryElements.selected);
            strata.setContainerElements('sCompositionMainElements', $scope.sCompositionMainElements.selected);
            strata.setContainerElements('sCompositionSecondaryElements', $scope.sCompositionSecondaryElements.selected);
            strata.setContainerElements('dCompositionMainElements', $scope.dCompositionMainElements.selected);
            strata.setContainerElements('dCompositionSecondaryElements', $scope.dCompositionSecondaryElements.selected);
            strata.setContainerElements('cpCompositionMainElements', $scope.cpCompositionMainElements.selected);
            strata.setContainerElements('cpCompositionSecondaryElements', $scope.cpCompositionSecondaryElements.selected);
            strata.setContainerElements('cpCompositionCompounds', $scope.cpCompositionCompounds.selected);

            //strata.updateCharacteristicList('cpCompositionExtensionFamily',$scope.selectedCpcompositionextensionFamily);
            strata.setContainerElements('cpCompositionAdditionalElements', $scope.cpCompositionAdditionalElements.selected);

            //Ajout  des composition aux deux strates enfant de la strate CM
            if (strata.getNature() == 'Corroded metal') {

                strata.setContainerElements("cmcpCompositionAdditionalElements", $scope.cmcpCompositionAdditionalElements.selected);
                strata.setContainerElements("cmcpagCompositionAdditionalElements", $scope.cmcpagCompositionAdditionalElements.selected);
                strata.setContainerElements("cmmCompositionAdditionalElements", $scope.cmmCompositionAdditionalElements.selected);
            }

            strata.setSecondaryComponentContainerElements("cpCompositionMainElements", $scope.secondaryComponents[0].mainElements.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionSecondaryElements", $scope.secondaryComponents[0].secondaryElements.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionCompounds", $scope.secondaryComponents[0].compounds.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionAdditionalElements", $scope.secondaryComponents[0].additionalElements.selected);

            $scope.$emit('updateSelectedStrata');
            $scope.$emit('updateFormOnly');
        };

        //Appelée lorsqu'on change déplace le slider dans la composition d'une strate CM
        $scope.ratioChange = function () {

            var ratioChar = new Characteristic();

            var rName = 'r' + $scope.ratio.ratio;
            ratioChar.setName(rName + 'Characteristic');
            ratioChar.setRealName(rName);
            ratioChar.setFamily('cmCorrosionRatioFamily');
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            strata.replaceCharacteristic(ratioChar);
            //mise à jour du dessin
            $scope.$emit('updateSelectedStrata');
        };
    })
    .filter("filterCompounds", function() { // register new angular filter
            // helper function
            function extractElements(compound) {
            /** Parses the compound formula and returns elements
             * @param {!compound} String name of the compound including formula in brackets
             *     for example "Chalconatronite (CuNa2(CO3)2.3H2O)"
             *
             * @return {[String]} list of elements found in formula (symbol strings).
             *     ["Cu", "Na", "C", "O", "H"]
             */
                // first split formula using Upper case Lower case element as separator (and include them in the result as group)
            let preClosingParenthesisIndex = compound.search(/(\).*?\()/g);
            if (preClosingParenthesisIndex != -1)
                compound = compound.substring(preClosingParenthesisIndex);
            let formulaIndex = compound.indexOf('(');
            if (formulaIndex == -1)
                return [];
            else
                compound = compound.substring(formulaIndex);
            let seachUlElements = compound.split(/([A-Z][a-z])/g);
            let elements = [];
            for (let ulCandidate of seachUlElements) {
                if (ulCandidate !== '') {
                    if (ulCandidate.match(/[A-Z][a-z]/)) {
                        elements.push(ulCandidate);
                    }
                    else {
                        //Extract the single letters elements
                        let singleLetterElements = ulCandidate.match(/[A-Z]/g);
                        if (singleLetterElements) {
                            // Add them to the elements list
                            Array.prototype.push.apply(elements, singleLetterElements);
                        }
                    }
                }
            }
            return elements;
        }
        // core stateless "filterCompounds"  function
        return function(compounds, mainElements, secondaryElements, filterMethod)
            /**
             * Filter the compounds list to return only those containing the list of all elements in
             * mainElements and secondaryElements arrays
             *
             * @param compounds:  input array of compounds to filter
             * @param mainElements:  Array of main elements (filter criteria)
             * @param secondaryElements: Array of secondary elements (filter criteria)
             * @param filterMethod: string
             *          - "exact": only compounds containing only mainElements and secondaryElements are returned
             *          - "atleast":  compounds containing at least mainElements and secondaryElements are returned
             *            (compounds with other additional elements might be returned)
             *          - "any": compounds having any of the composition elements are returned
             */
        {
            compounds = compounds || []; // make sure compounds is valid as AngularJS calls filter function with undefined input as part of digest / $parseFilter cycle (causing exceptions)
                                         // (not explicitely required in ng doc but see example at https://docs.angularjs.org/guide/filter#creating-custom-filters
            return compounds.filter(function (compound, index, array) {
                function inCompound(element) {
                    // tests if the Element symbol is found inside the compound formula parenthesises
                    // e.g. in "Antlerite (Cu3(OH)4SO4)"
                    var search_re = new RegExp("\\(.*" + element.symbol + ".*\\)");
                    return (compound.real_name.search(search_re) != -1);
                    //return (compound.real_name.indexOf(element.symbol) != -1);
                }
                switch(filterMethod)
                {
                    case "exact":
                        let compoundElements = extractElements(compound.real_name);
                        let allcpElements = mainElements.selected.map(e => e.symbol).concat(secondaryElements.selected.map(e => e.symbol));
                        return allcpElements.every(symbol => compoundElements.includes(symbol)) && compoundElements.every(symbol => allcpElements.includes(symbol));
                    case "atleast":
                        return (mainElements.selected.every(inCompound) && secondaryElements.selected.every(inCompound));
                    case "any":
                        return (mainElements.selected.some(inCompound) || secondaryElements.selected.some(inCompound));
                }

            });
        };
});
